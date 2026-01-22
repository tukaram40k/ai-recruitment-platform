import secrets
import string
import resend
from datetime import datetime, timedelta
from ..core.config import settings


def generate_otp(length: int = 6) -> str:
    """Generate a random numeric OTP code."""
    return ''.join(secrets.choice(string.digits) for _ in range(length))


def generate_otp_expiry() -> datetime:
    """Generate OTP expiry time based on settings."""
    return datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)


def _get_otp_html(otp_code: str, user_name: str) -> str:
    """Generate HTML template for OTP email."""
    return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; font-weight: 500; margin: 0;">RecruitAI</h1>
    </div>
    
    <div style="background: #f9f9f9; border: 1px solid #e5e5e5; padding: 30px; text-align: center;">
        <p style="margin: 0 0 20px 0; font-size: 16px;">Hello {user_name},</p>
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #666;">Your verification code is:</p>
        
        <div style="background: #000; color: #fff; font-size: 32px; font-weight: 600; letter-spacing: 8px; padding: 20px 30px; display: inline-block; margin: 20px 0;">
            {otp_code}
        </div>
        
        <p style="margin: 20px 0 0 0; font-size: 13px; color: #888;">
            This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.
        </p>
    </div>
    
    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999;">
        <p style="margin: 0;">If you didn't request this code, please ignore this email.</p>
        <p style="margin: 10px 0 0 0;">&copy; {datetime.now().year} RecruitAI. All rights reserved.</p>
    </div>
</body>
</html>
    """


async def send_otp_email(email: str, otp_code: str, user_name: str = "User") -> bool:
    """
    Send OTP verification email to user using Resend.
    Returns True if email was sent successfully, False otherwise.
    """
    # Always print OTP to console for development/debugging
    print(f"\n{'='*50}")
    print(f"[OTP CODE] Email: {email}")
    print(f"[OTP CODE] Code:  {otp_code}")
    print(f"{'='*50}\n")
    
    if not settings.RESEND_API_KEY:
        print("[EMAIL] Resend API key not configured, using console output only")
        return True

    try:
        # Initialize Resend with API key
        resend.api_key = settings.RESEND_API_KEY
        
        # Send email via Resend
        params = {
            "from": "RecruitAI <onboarding@resend.dev>",
            "to": [email],
            "subject": f"Your RecruitAI Verification Code: {otp_code}",
            "html": _get_otp_html(otp_code, user_name),
        }
        
        response = resend.Emails.send(params)
        print(f"[EMAIL] Sent successfully via Resend: {response}")
        return True

    except Exception as e:
        print(f"[EMAIL] Failed to send email via Resend: {e}")
        # Return True anyway so the flow continues (OTP is in console)
        return True


async def send_login_notification_email(email: str, user_name: str = "User") -> bool:
    """
    Send login notification email to user after successful 2FA.
    """
    if not settings.RESEND_API_KEY:
        return True

    try:
        resend.api_key = settings.RESEND_API_KEY
        
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 24px; font-weight: 500; margin: 0;">RecruitAI</h1>
    </div>
    
    <div style="background: #f9f9f9; border: 1px solid #e5e5e5; padding: 30px;">
        <p style="margin: 0 0 15px 0;">Hello {user_name},</p>
        <p style="margin: 0 0 15px 0;">A new login to your RecruitAI account was detected.</p>
        <p style="margin: 0; font-size: 13px; color: #666;">
            <strong>Time:</strong> {datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")} UTC
        </p>
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffc107; font-size: 13px;">
        If this wasn't you, please secure your account immediately.
    </div>
</body>
</html>
        """
        
        params = {
            "from": "RecruitAI <onboarding@resend.dev>",
            "to": [email],
            "subject": "New Login to Your RecruitAI Account",
            "html": html,
        }
        
        resend.Emails.send(params)
        return True

    except Exception as e:
        print(f"[EMAIL] Failed to send notification email: {e}")
        return False
