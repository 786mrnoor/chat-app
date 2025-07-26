export default function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully', success: true });

  // console.log('[User logged-out]');
}
