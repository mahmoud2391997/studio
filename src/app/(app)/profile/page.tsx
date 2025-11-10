'use client';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { app } from '@/lib/firebase';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { logOutAction } from '@/app/auth/actions';

const auth = getAuth(app);

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setName(currentUser.displayName || '');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  const handleNameChange = async () => {
    if (!user || !name.trim()) return;

    try {
      await updateProfile(user, { displayName: name.trim() });
      toast({
        title: 'Success',
        description: 'Your name has been updated.',
      });
      // Re-fetch user or update state to reflect change
      setUser({ ...user, displayName: name.trim() } as User);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update your name.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load user profile. Please try logging in again.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => logOutAction()}>Log In</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and personal information.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>View and edit your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email || ''} readOnly disabled />
            <p className="text-sm text-muted-foreground">Your email address cannot be changed.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={handleNameChange}>Save</Button>
                <Button variant="outline" onClick={() => { setIsEditing(false); setName(user.displayName || ''); }}>Cancel</Button>
              </div>
            ) : (
               <div className="flex items-center gap-2">
                <Input id="name" value={user.displayName || ''} readOnly disabled />
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline">Change Password</Button>
            <Button variant="destructive" onClick={() => logOutAction()}>Log Out</Button>
        </CardFooter>
      </Card>
    </div>
  );
}


function ProfileSkeleton() {
  return (
     <div className="flex flex-col gap-8">
      <div>
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="mt-2 h-5 w-3/4" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/4" />
          <Skeleton className="mt-2 h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
           <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
         <CardFooter className="flex justify-between border-t pt-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    </div>
  )
}
