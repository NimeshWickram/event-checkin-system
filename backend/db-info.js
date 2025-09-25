const { MongoClient } = require('mongodb');

async function checkDatabaseInfo() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB server');
    
    // List all databases
    const adminDb = client.db().admin();
    const dbInfo = await adminDb.listDatabases();
    
    console.log('\n=== AVAILABLE DATABASES ===');
    dbInfo.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // Check if our database exists
    const dbExists = dbInfo.databases.some(db => db.name === 'event-checkin');
    console.log(`\n=== OUR DATABASE ===`);
    if (dbExists) {
      console.log('✅ Database "event-checkin" exists');
      
      // Check collections in our database
      const db = client.db('event-checkin');
      const collections = await db.listCollections().toArray();
      
      console.log('\n=== COLLECTIONS IN event-checkin ===');
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
      
      // Count documents in tickets collection
      if (collections.some(c => c.name === 'tickets')) {
        const ticketCount = await db.collection('tickets').countDocuments();
        console.log(`\n=== TICKET COUNT ===`);
        console.log(`Total tickets: ${ticketCount}`);
      }
    } else {
      console.log('❌ Database "event-checkin" NOT found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkDatabaseInfo();