// components/Authentication/LoginForm.tsx
'use client';
import React, { useState } from 'react';
import EnterPhoneForm from './EnterPhone';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

type AuthStep = 'ENTER_PHONE' | 'LOGIN' | 'REGISTER';

interface LoginFormProps {
    onAuthSuccess: () => void;
}

export default function LoginForm({ onAuthSuccess }: LoginFormProps) {
    const [currentStep, setCurrentStep] = useState<AuthStep>('ENTER_PHONE');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePhoneCheck = (mobile: string, userExists: boolean) => {
        setPhoneNumber(mobile);
        if (userExists) {
            setCurrentStep('LOGIN');
        } else {
            setCurrentStep('REGISTER');
        }
    };
    
    // بازگشت به مرحله وارد کردن شماره تلفن
    const handleBackToPhone = () => {
        setCurrentStep('ENTER_PHONE');
        setPhoneNumber('');
    };

    const renderStepComponent = () => {
        switch (currentStep) {
            case 'ENTER_PHONE':
                return <EnterPhoneForm 
                            onCheck={handlePhoneCheck} 
                            onSuccess={onAuthSuccess} // در صورت ورود با Guest/Skip
                        />;
            case 'LOGIN':
                return <SignInForm 
                            phone={phoneNumber} 
                            onBack={handleBackToPhone} 
                            onSuccess={onAuthSuccess} 
                        />;
            case 'REGISTER':
                return <SignUpForm 
                            phone={phoneNumber} 
                            onBack={handleBackToPhone} 
                            onSuccess={onAuthSuccess} 
                        />;
            default:
                return null;
        }
    };

    return (
        <div className="relative">
            {renderStepComponent()}
        </div>
    );
}