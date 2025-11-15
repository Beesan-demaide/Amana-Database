import { connectToDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering for fresh data

export async function GET() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('books');
    
    // Find all documents in the 'books' collection
    const books = await collection.find({}).toArray();

    // Return the array of books as a JSON response
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("Error fetching all books:", error);
    return NextResponse.json(
      { message: 'Internal Server Error fetching books.' },
      { status: 500 }
    );
  }
}