import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; 

export async function GET(request: Request,context: any     
) {
  const { id: bookId } = context.params;
  
  // Define the search query object
  let query: any;

  if (!bookId) {
     return NextResponse.json(
      { message: 'Missing Book ID provided.' },
      { status: 400 }
    );
  }

  // Check if the ID is a valid ObjectId (24-character string)
  if (ObjectId.isValid(bookId)) {
    query = { _id: new ObjectId(bookId) };
  } 
  // If not a valid ObjectId, check if it's a simple number (1, 2, 3...)
  else if (!isNaN(Number(bookId))) {
    const numericId = Number(bookId);
    
    // Use $or to search for the ID as either a number or a string to handle 
    // inconsistencies in how simple IDs might be stored in MongoDB.
    query = { 
      $or: [
        { _id: numericId }, 
        { _id: String(bookId) } 
      ]
    };
  } else {
    // If the format is completely invalid
     return NextResponse.json(
      { message: 'Invalid Book ID format provided. Must be a number or a valid ObjectId.' },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    const collection = db.collection('books');

    const book = await collection.findOne(query);

    if (!book) {
      return NextResponse.json({ message: 'Book not found.' }, { status: 404 });
    }

    return NextResponse.json(book, { status: 200 });

  } catch (error) {
    console.error('Error fetching single book:', error);
    return NextResponse.json(
      { message: 'Internal Server Error fetching book.' },
      { status: 500 }
    );
  }
}