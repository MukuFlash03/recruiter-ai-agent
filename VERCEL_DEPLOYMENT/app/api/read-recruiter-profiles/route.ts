import { createClient } from '@/lib/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('recruiter_profiles')
      .select()
    if (error) throw error;

    return NextResponse.json({ message: 'Recruiter profiles fetched successfully', data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch recruiter profiles data' }, { status: 500 });
  }
}