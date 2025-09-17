"use client";

import { createContext, useContext, useState } from 'react';

interface ProfileCustomize {
    fontSize: number;
    caretStyle: 'block' | 'line' | 'underline' | 'off';
}

interface Profile {
    customize: ProfileCustomize;
}

interface ProfileContextType {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

const defaultProfile: Profile = {
    customize: {
        fontSize: 16,
        caretStyle: 'line'
    }
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
    children: React.ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
    const [profile, setProfile] = useState<Profile>(defaultProfile);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}

export { ProfileContext };