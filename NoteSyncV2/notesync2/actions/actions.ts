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
    // Not signed in → redirect to Clerk’s sign-in route
    redirect("/sign-in");
  } 

  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Doc",
    userId, 
  });

  //return docRef;

    const userEmail = typeof sessionClaims?.email === 'string' ? sessionClaims.email : '';

    //once the document is created i need to create for that user who was logged in, hey're basically using the document ID that we just created, I need to add them to the room ao that they are a part of that room
    await adminDb
    .collection('users')
    .doc(userEmail)
    //.doc(userId) //  use userId instead of email because line above this was giving error
    .collection('rooms')
    .doc(docRef.id)
    .set({
        userId: sessionClaims?.email!,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id
    });

    return {docId: docRef.id};
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