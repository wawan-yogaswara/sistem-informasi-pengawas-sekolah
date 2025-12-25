import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Initialize Supabase client with correct configuration
    const supabaseUrl = process.env.SUPABASE_URL || 'https://glhaliktsrcvnznbgxqt.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaGFsaWt0c3Jjdm56bmJneHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjYyMjQsImV4cCI6MjA4MTk0MjIyNH0._kaFo2h7rCdouJp2rpb1lmEvlR6gAc0c3AnRjM_PhP4';
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (req.method === 'GET') {
      console.log('🔍 Getting schools from Supabase...');
      
      try {
        const { data: schools, error } = await supabase
          .from('schools')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Supabase error:', error);
          throw error;
        }

        console.log('✅ Schools from Supabase:', schools?.length || 0, 'records');
        return res.json(schools || []);

      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        
        // Return sample data as fallback
        const sampleSchools = [
          {
            id: '1',
            name: 'SDN 1 Garut',
            address: 'Jl. Raya Garut No. 1',
            phone: '0262-123456',
            principal: 'Drs. Ahmad Suryadi',
            email: 'sdn1garut@email.com',
            created_at: new Date().toISOString()
          },
          {
            id: '2', 
            name: 'SMPN 2 Garut',
            address: 'Jl. Pendidikan No. 2',
            phone: '0262-123457',
            principal: 'Dra. Siti Nurhalimah',
            email: 'smpn2garut@email.com',
            created_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'SMAN 1 Garut',
            address: 'Jl. Merdeka No. 3',
            phone: '0262-123458',
            principal: 'Dr. Budi Santoso, M.Pd',
            email: 'sman1garut@email.com',
            created_at: new Date().toISOString()
          }
        ];
        
        console.log('📦 Using fallback sample data');
        return res.json(sampleSchools);
      }

    } else if (req.method === 'POST') {
      console.log('📝 Creating new school...');
      const { name, address, phone, principal, email } = req.body;

      if (!name || !address) {
        return res.status(400).json({ error: 'Name and address are required' });
      }

      try {
        console.log('💾 Saving to Supabase:', { name, address, phone, principal, email });
        
        const { data: school, error } = await supabase
          .from('schools')
          .insert({
            name,
            address,
            phone: phone || '',
            principal: principal || '',
            email: email || ''
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase insert error:', error);
          throw error;
        }

        console.log('✅ School saved to Supabase:', school);
        return res.status(201).json(school);

      } catch (dbError) {
        console.error('❌ Database save error:', dbError);
        
        // Return mock response as fallback
        const newSchool = {
          id: Date.now().toString(),
          name,
          address,
          phone: phone || '',
          principal: principal || '',
          email: email || '',
          created_at: new Date().toISOString()
        };

        console.log('📦 Returning fallback response:', newSchool);
        return res.status(201).json(newSchool);
      }

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Schools API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}