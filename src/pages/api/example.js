import clientPromise from '../db/connect';

export default async function handler(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db('testdb'); // Replace with your DB name
        const data = await db.collection('users').find({}).toArray();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
