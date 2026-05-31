const nodemailer = require('nodemailer');

// 메일 전송 객체 생성
// 환경변수에 설정된 값이 없을 경우 로컬 개발 환경용 설정을 고려하거나 실패 처리할 수 있습니다.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: true, // 465 포트는 true, 587 포트는 false 권장
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * 이메일 전송 유틸리티 함수
 * @param {Object} options - 메일 전송 옵션
 * @param {string} options.to - 수신자 이메일 주소
 * @param {string} options.subject - 메일 제목
 * @param {string} options.text - 일반 텍스트 본문 (옵션)
 * @param {string} options.html - HTML 본문 (옵션)
 */
const sendMail = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ 이메일 전송 실패: SMTP 설정(SMTP_USER, SMTP_PASS)이 누락되었습니다. .env 파일을 확인해주세요.');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"EcoBid" <noreply@ecobid.com>',
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ 이메일 전송 성공: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ 이메일 전송 실패:', error);
    throw error;
  }
};

module.exports = {
  sendMail,
};
