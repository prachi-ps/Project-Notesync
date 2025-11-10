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

    // Commit both operations atomically
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
  //auth().protect();   //error, not working
  //const session = await auth();
  //session.protect(); 
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("deleteDocument", roomId);

  try{
    //delete the document reference itself
    await adminDb.collection("documents").doc(roomId).delete();

    const query = await adminDb
    .collectionGroup("rooms")
    .where("roomId", "==", roomId)
    .get();

    const batch = adminDb.batch();

    //delete the room reference in user's collection for every user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    //delete liveblocks room
    await liveblocks.deleteRoom(roomId);
    return {success: true}; 

  } catch (error) {
    console.error(error);
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
    await adminDb
    .collection("users")
    .doc(email)
    .collection("rooms")
    .doc(roomId)
    .set({
      userId: email, 
      role: "editor",
      createdAt: new Date(),
      roomId,
    })
    return {success: true};
  }catch(error){
    console.error(error);
    return {success: true};
  }
}



export async function removeUserFromDocument(roomId:string, email: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("RemoveUserFromDocument", roomId, email);

  try{
    await adminDb
    .collection("users")
    .doc(email)
    .collection("rooms")
    .doc(roomId)
    .delete();
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
    // Use collectionGroup query on server-side (admin SDK doesn't require indexes)
    const querySnapshot = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      userId: doc.data().userId,
      role: doc.data().role,
      createdAt: doc.data().createdAt,
      roomId: doc.data().roomId,
    }));

    return { success: true, users };
  } catch (error) {
    console.error("Error getting users in room:", error);
    return { success: false, users: [] };
  }
}