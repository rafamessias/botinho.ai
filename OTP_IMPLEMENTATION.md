# OTP Implementation Guide

This document explains how to use the OTP (One-Time Password) verification system that has been implemented as an alternative to email confirmation.

## Overview

The OTP system allows users to verify their accounts using a 6-digit code sent via SMS instead of clicking an email confirmation link. This provides a more streamlined mobile-first experience.

## Environment Variables

To enable OTP verification, set the following environment variables:

```bash
# Enable OTP verification (set to 'true' to enable)
OTP_ENABLED="true"
```

When `OTP_ENABLED` is set to `false` (default), the system will use the traditional email confirmation flow.

## How It Works

### 1. User Registration
- User fills out the sign-up form with email and phone number
- If OTP is enabled, a 6-digit code is generated and stored in the `confirmationToken` field
- The code is sent via SMS (placeholder implementation) and email (fallback)

### 2. OTP Verification
- User is redirected to `/sign-up/otp` page
- User enters the 6-digit code using the shadcn UI OTP component
- Code is validated against the database
- Upon successful verification, user account is confirmed

### 3. Resend Functionality
- Users can request a new OTP code if they didn't receive it
- New 6-digit code is generated and sent

## Files Created/Modified

### New Files
- `app/[locale]/sign-up/otp/page.tsx` - OTP verification page
- `components/sign-up/otp-form.tsx` - OTP input form component
- `emails/OTPEmail.tsx` - Professional OTP email template

### Modified Files
- `components/sign-up/sign-up-form.tsx` - Added OTP flow logic
- `components/server-actions/auth.ts` - Added OTP server actions
- `i18n/messages/en.json` - Added English translations
- `i18n/messages/pt-BR.json` - Added Portuguese translations

## Server Actions Added

### `confirmOTPAction(otp, email?, phone?)`
Validates the 6-digit OTP code and confirms the user account.

### `resendOTPAction(email?, phone?)`
Generates and sends a new OTP code to the user.

## SMS Provider Integration

The current implementation includes placeholder code for SMS sending. To integrate with a real SMS provider:

1. Choose your SMS provider (Twilio, AWS SNS, etc.)
2. Add your API credentials to environment variables
3. Replace the placeholder SMS sending code in `resendOTPAction` and `signUpAction`
4. Update the TODO comments in the code

Example SMS integration:
```typescript
// Replace this placeholder:
console.log(`OTP for ${phone}: ${newOTP}`)

// With your SMS provider:
await sendSMS({
    to: phone,
    message: `Your verification code is: ${newOTP}`
})
```

## Database Schema

The OTP system uses the existing `confirmationToken` field in the `User` table:
- For email confirmation: stores a random token
- For OTP verification: stores a 6-digit numeric code

## Security Considerations

1. **OTP Expiration**: Consider adding an expiration time for OTP codes
2. **Rate Limiting**: Implement rate limiting for OTP requests
3. **SMS Costs**: Monitor SMS usage and costs
4. **Fallback**: Email is used as fallback when SMS fails

## Testing

To test the OTP implementation:

1. Set `OTP_ENABLED="true"` in your environment
2. Register a new user
3. Check the console logs for the OTP code (development mode)
4. Enter the code on the OTP verification page
5. Verify the account is confirmed

## Future Enhancements

- Add OTP expiration time
- Implement rate limiting
- Add SMS delivery status tracking
- Support for voice OTP
- International SMS support
- OTP attempt limits
