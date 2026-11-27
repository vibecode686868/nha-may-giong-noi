# Nhà Máy Giọng Nói - NGUYENDUONG686

App tạo đoạn mô tả giọng nói cho Minimax theo 20 template ngành nghề, phục vụ xây dựng thương hiệu cá nhân.

## Tính năng
- Đăng nhập bằng tài khoản Google (Firebase Authentication).
- 20 template ngành nghề dạng thẻ.
- Nhập 1 câu ngắn, nhận đoạn mô tả tiếng Việt, bản tiếng Anh và câu đọc thử.
- Mỗi người dùng tự gắn API key: Claude, Google Gemini hoặc ChatGPT. Key chỉ lưu trên trình duyệt của người dùng.
- Chế độ Local miễn phí, không cần API key.

## Cài Firebase
1. Vào console.firebase.google.com, tạo project mới.
2. Authentication > Sign-in method > bật Google.
3. Project settings > Your apps > thêm Web app, sao chép cấu hình.
4. Điền apiKey, authDomain, projectId, appId vào file firebase-config.js.
5. Authentication > Settings > Authorized domains > thêm tên miền Vercel của app.

## Deploy Vercel
Vào vercel.com > Add New > Project > Import repo này > Deploy. Không cần cấu hình thêm.
