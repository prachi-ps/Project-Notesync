
/*
export async function POST(req: NextRequest) {
    // ensure user is authenticated by 
    auth().protect();
    
    const { userId, sessionClaims } = await auth();
}
*/

/*
import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {        */
  // Ensure user is authenticated

  /*
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // If authenticated → handle request
  //return NextResponse.json({ message: "Success!" });

  const { sessionClaims } = await auth();
  const { room } = await req.json();

  const session = liveblocks.prepareSession(sessionClaims?.email!, {
    userInfo: {
      name: sessionClaims?.fullName!,
      email: sessionClaims?.email!,
      avatar: sessionClaims?.image!,
    },
  });
  */


  /*
  const { userId, sessionClaims } = await auth();

if (!userId) {
  return new NextResponse("Unauthorized", { status: 401 });
}

const { room } = await req.json();

const session = liveblocks.prepareSession(userId, {
  userInfo: {
    name: (sessionClaims as any)?.fullName ?? "Anonymous",
    email: (sessionClaims as any)?.email ?? "",
    avatar: (sessionClaims as any)?.image ?? undefined,
  },
});


  const usersInRoom = await adminDb
  .collectionGroup("rooms")
  .where("userId", "==", sessionClaims?.userId)
  .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    console.log("You are authorized!");

    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 }
    );
  }

}

*/




import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { room } = await req.json();
  const userEmail = (sessionClaims as any)?.email;

  if(!userEmail){
    return NextResponse.json(
      { message: "User email not not found." },
      { status: 403 }
    );
  }

  // Create Liveblocks session using Clerk userId
  const session = liveblocks.prepareSession(userId, {
    userInfo: {
      name: (sessionClaims as any)?.fullName ?? "Anonymous",
      email: userEmail,      //(sessionClaims as any)?.email ?? "",
      avatar: (sessionClaims as any)?.image ?? undefined,
    },
  });

  //  Querying Firestore with Clerk userId (not sessionClaims.userId) 
  /*THIS IS WRONG
  const usersInRoom = await adminDb
    .collection("users")
  .doc(userId)
  .collection("rooms")
  .get();     */

  const userRoomDoc = await adminDb
  .collection("users")
  .doc(userEmail)
  .collection("rooms")
  .doc(room)
  .get();

  

    /*.collectionGroup("rooms")
    .where("userId", "==", userId)
    .get();*/

  //const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  if (userRoomDoc.exists) {
    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();

    console.log("You are authorized!");
    return new Response(body, { status });
  } else {
    
    console.log(`User ${userEmail} not found in room ${room}.`);
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 }
    );
    
  }
}



