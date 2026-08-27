import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type AuthValue={user:User|null;session:Session|null;loading:boolean;configured:boolean;signOut:()=>Promise<void>};
const AuthContext=createContext<AuthValue>({user:null,session:null,loading:true,configured:false,signOut:async()=>undefined});

export function AuthProvider({children}:{children:ReactNode}){
 const[session,setSession]=useState<Session|null>(null);const[loading,setLoading]=useState(true);
 useEffect(()=>{if(!supabase){setLoading(false);return;}void supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false);});const{data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{setSession(next);setLoading(false);});return()=>subscription.unsubscribe();},[]);
 const value=useMemo<AuthValue>(()=>({user:session?.user??null,session,loading,configured:isSupabaseConfigured,signOut:async()=>{if(supabase)await supabase.auth.signOut();}}),[session,loading]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
// Hook intentionally shares the provider module so the session has one context instance.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth=()=>useContext(AuthContext);
