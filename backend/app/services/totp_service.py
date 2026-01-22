import pyotp
import qrcode
import io
import base64
from typing import Tuple


def generate_totp_secret() -> str:
    """Generate a new TOTP secret."""
    return pyotp.random_base32()


def get_totp_uri(secret: str, email: str, issuer: str = "RecruitAI") -> str:
    """Generate otpauth:// URI for QR code."""
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email, issuer_name=issuer)


def generate_qr_code(uri: str) -> str:
    """Generate QR code as base64 string."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(uri)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


def setup_totp(email: str) -> Tuple[str, str, str]:
    """
    Set up TOTP for a user.
    Returns (secret, qr_code_base64, otpauth_uri)
    """
    secret = generate_totp_secret()
    uri = get_totp_uri(secret, email)
    qr_code = generate_qr_code(uri)
    
    return secret, qr_code, uri


def verify_totp(secret: str, code: str) -> bool:
    """
    Verify a TOTP code.
    Allows 1 interval tolerance for clock drift.
    """
    if not secret or not code:
        return False
    
    totp = pyotp.TOTP(secret)
    # valid_window=1 allows codes from 30 seconds before/after
    return totp.verify(code, valid_window=1)
