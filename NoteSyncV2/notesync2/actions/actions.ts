/*
'use server';       //tells that this is a server action

import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
    auth().protect();                 //if we try without login, we'll be thrwn to clerk login screen
    
    const {sessionClaims} = await auth();

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc"
    })
*/

/*
'use server';

import { adminDb } from "@/firebase-admin";
import { auth, redirectToSignIn } from "@clerk/nextjs/server";

export async function createNewDocument() {
  // Get auth info (no await needed, returns sync object in v6)
  const { sessionClaims, userId } = auth();

  // Protect manually
  if (!userId) {
    return RedirectToSignIn();
  }

  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Doc",
    userId, // good idea to store who owns it
  });

  //return docRef;
*/




'use server';

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createNewDocument() {
  const { sessionClaims, userId } = await auth(); //  await here

  if (!userId) {
    // Not signed in → redirect to Clerk's sign-in route
    redirect("/sign-in");
  } 

  try {
    const userEmail = typeof sessionClaims?.email === 'string' ? sessionClaims.email : '';

    if (!userEmail) {
      throw new Error('User email is required');
    }

    // Create document and room in a batch to ensure atomicity
    const batch = adminDb.batch();

    // Create the document
    const docRef = adminDb.collection("documents").doc();
    batch.set(docRef, {
      title: "New Doc",
      userId, 
      createdAt: new Date(),
    });

    // Create the room reference for the user
    const roomRef = adminDb
      .collection('users')
      .doc(userEmail)
      .collection('rooms')
      .doc(docRef.id);
    
    batch.set(roomRef, {
      userId: userEmail,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id
    });

    // Also add to members subcollection for easy tracking during deletion
    const memberRef = docRef.collection('members').doc(userEmail);
    batch.set(memberRef, {
      email: userEmail,
      role: "owner",
      addedAt: new Date(),
    });

    // Commit all operations atomically
    await batch.commit();

    // Wait a brief moment to ensure Firestore has propagated the changes
    // This helps prevent race conditions when the client immediately queries
    await new Promise(resolve => setTimeout(resolve, 100));

    return {docId: docRef.id};
  } catch (error) {
    console.error('Error creating new document:', error);
    throw error;
  }
}

export async function deleteDocument(roomId:string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("deleteDocument", roomId);

  try{
    // Get the document first to check if it exists and get member list if stored
    const docRef = adminDb.collection("documents").doc(roomId);
    const docSnapshot = await docRef.get();
    
    let userEmails: string[] = [];
    
    // Try to get members from a members subcollection (if we've implemented it)
    // Otherwise, we'll need to handle orphaned references
    try {
      const membersSnapshot = await docRef.collection("members").get();
      userEmails = membersSnapshot.docs.map(doc => doc.id);
    } catch (error) {
      // Members subcollection might not exist yet - that's okay
      console.log("No members subcollection found, will clean up what we can");
    }

    // Delete the document reference itself
    await docRef.delete();

    // Delete room references for known users using direct paths
    // This avoids collectionGroup queries which require indexes
    if (userEmails.length > 0) {
      const batch = adminDb.batch();
      
      userEmails.forEach((email) => {
        const roomRef = adminDb
          .collection("users")
          .doc(email)
          .collection("rooms")
          .doc(roomId);
        batch.delete(roomRef);
      });

      // Firestore batches have a limit of 500 operations
      if (userEmails.length <= 500) {
        await batch.commit();
      } else {
        // If more than 500 users, commit in chunks
        const chunks = [];
        for (let i = 0; i < userEmails.length; i += 500) {
          chunks.push(userEmails.slice(i, i + 500));
        }
        for (const chunk of chunks) {
          const chunkBatch = adminDb.batch();
          chunk.forEach((email) => {
            const roomRef = adminDb
              .collection("users")
              .doc(email)
              .collection("rooms")
              .doc(roomId);
            chunkBatch.delete(roomRef);
          });
          await chunkBatch.commit();
        }
      }
    }

    // Delete liveblocks room
    await liveblocks.deleteRoom(roomId);
    return {success: true}; 

  } catch (error) {
    console.error("Error deleting document:", error);
    return { success: false };
  }
}


export async function inviteUserToDocument(roomId:string, email:string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("inviteUserToDocument", roomId, email);

  try{
    const batch = adminDb.batch();

    // Add to user's rooms collection
    const userRoomRef = adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId);
    
    batch.set(userRoomRef, {
      userId: email, 
      role: "editor",
      createdAt: new Date(),
      roomId,
    });

    // Also add to document's members subcollection for tracking
    const docRef = adminDb.collection("documents").doc(roomId);
    const memberRef = docRef.collection('members').doc(email);
    batch.set(memberRef, {
      email: email,
      role: "editor",
      addedAt: new Date(),
    });

    await batch.commit();
    return {success: true};
  }catch(error){
    console.error(error);
    return {success: false};
  }
}



export async function removeUserFromDocument(roomId:string, email: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("RemoveUserFromDocument", roomId, email);

  try{
    const batch = adminDb.batch();

    // Remove from user's rooms collection
    const userRoomRef = adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId);
    batch.delete(userRoomRef);

    // Also remove from document's members subcollection
    const docRef = adminDb.collection("documents").doc(roomId);
    const memberRef = docRef.collection('members').doc(email);
    batch.delete(memberRef);

    await batch.commit();
    return {success: true};
  } catch(error){
    console.error(error);
    return {success: false};
  }
}

export async function getUsersInRoom(roomId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Use members subcollection instead of collectionGroup to avoid index requirement
    const docRef = adminDb.collection("documents").doc(roomId);
    const membersSnapshot = await docRef.collection("members").get();

    const users = membersSnapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Convert Firestore Timestamp to plain object (ISO string)
      let createdAt: string | undefined;
      const timestamp = data.addedAt || data.createdAt;
      if (timestamp) {
        // Check if it's a Firestore Timestamp
        if (timestamp.toDate && typeof timestamp.toDate === 'function') {
          createdAt = timestamp.toDate().toISOString();
        } else if (timestamp instanceof Date) {
          createdAt = timestamp.toISOString();
        } else if (typeof timestamp === 'string') {
          createdAt = timestamp;
        } else if (timestamp._seconds) {
          // Handle Firestore Timestamp object structure
          const date = new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
          createdAt = date.toISOString();
        }
      }
      
      return {
        id: doc.id,
        userId: data.email || doc.id, // Use email from data or doc ID as fallback
        role: data.role || "editor",
        createdAt: createdAt,
        roomId: roomId,
      };
    });

    return { success: true, users };
  } catch (error) {
    console.error("Error getting users in room:", error);
    return { success: false, users: [] };
  }
}