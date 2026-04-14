# ClondyAPI

ClondyAPI là backend RESTful dành cho ứng dụng mạng xã hội hoặc nền tảng chia sẻ hình ảnh với hỗ trợ đăng ký/đăng nhập, quản lý người dùng, upload ảnh, quan hệ bạn bè, chat thời gian thực và xác thực email.

## Tổng quan

Dự án được xây dựng bằng Node.js và Express, kết nối với MongoDB để lưu trữ dữ liệu người dùng, ảnh và tin nhắn. ClondyAPI cung cấp:

- Xác thực JWT cho người dùng và admin.
- API người dùng với đăng ký, đăng nhập, đổi mật khẩu, cập nhật avatar và báo cáo/feedback.
- Quản lý ảnh với upload lên Cloudinary và truy vấn ảnh cá nhân, bạn bè hoặc toàn bộ hệ thống.
- Quan hệ bạn bè: gửi yêu cầu, chấp nhận, hủy và tìm kiếm bạn bè.
- Tin nhắn thời gian thực bằng Socket.IO.
- OTP/email verification với Brevo.
- Kiểm tra trạng thái hoạt động qua endpoint health check.

## Kiến trúc chính

- `index.js` - Điểm khởi động server, cấu hình Express, middleware và Socket.IO.
- `src/config` - Cấu hình cơ sở dữ liệu và các hằng số.
- `src/routes` - Định nghĩa các route API theo module.
- `src/controller` - Xử lý logic request/response.
- `src/service` - Business logic, tương tác với data và dịch vụ bên ngoài.
- `src/socket` - Khởi tạo Socket.IO và xác thực JWT cho kết nối realtime.
- `src/middleware` - Middleware xác thực quyền truy cập và xử lý lỗi.

## Công nghệ sử dụng

- Node.js
- Express
- MongoDB / Mongoose
- Socket.IO
- JWT
- Cloudinary
- Brevo (SIB API)
- Multer
- Morgan
- CORS

## Cài đặt và chạy

### 1. Cài đặt

```bash
npm install
```

### 2. Thiết lập biến môi trường

Tạo file `.env` trong thư mục gốc và thêm các khóa sau:

```bash
PORT=3000
MOGODB_URI=<your_mongodb_connection_string>
ACCESS_TOKEN_SECRET=<your_jwt_secret>
ACCESS_TOKEN_EXPIRE=1d
CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUD_API_KEY=<your_cloudinary_api_key>
CLOUD_API_SECRET=<your_cloudinary_api_secret>
BREVO_APIKEY=<your_brevo_api_key>
```

### 3. Chạy ứng dụng

- Chạy ở chế độ phát triển:

```bash
npm run dev
```

- Chạy ở chế độ sản xuất:

```bash
npm start
```

Ứng dụng sẽ lắng nghe trên `http://localhost:3000` hoặc cổng được cấu hình trong `.env`.

## Các endpoint chính

| Route | Mô tả |
| --- | --- |
| `/api/user/register` | Đăng ký người dùng |
| `/api/user/login` | Đăng nhập |
| `/api/user/forgotPassword` | Gửi yêu cầu quên mật khẩu |
| `/api/user/changePassword` | Đổi mật khẩu |
| `/api/user/myInfo` | Lấy thông tin người dùng hiện tại |
| `/api/user/updateAvatar` | Cập nhật ảnh đại diện |
| `/api/user/sendReport` | Gửi báo cáo |
| `/api/user/sendFeedback` | Gửi phản hồi |
| `/api/image/uploadImage` | Upload ảnh |
| `/api/image/myImages` | Lấy ảnh của người dùng |
| `/api/image/friendsImages` | Lấy ảnh của bạn bè |
| `/api/image/allImages` | Lấy toàn bộ ảnh |
| `/api/relationship/pending` | Lấy yêu cầu kết bạn đang chờ |
| `/api/relationship/friend` | Lấy danh sách bạn bè |
| `/api/message/newMessage` | Gửi tin nhắn |
| `/api/message/chatRooms` | Lấy danh sách phòng chat |
| `/api/system/health` | Kiểm tra trạng thái API |

## Chuẩn bị dữ liệu và quyền

- `ACCESS_TOKEN_SECRET` dùng để ký JWT cho người dùng và kết nối Socket.IO.
- Cloudinary được dùng để lưu trữ ảnh; cần có tài khoản Cloudinary hợp lệ.
- Brevo API được dùng để gửi email xác thực/OTP.

## Phát triển và mở rộng

- Tích hợp frontend tương tác với JWT và Socket.IO.
- Bổ sung phần refresh token và phân quyền chi tiết.
- Thêm logging và giám sát hoạt động production.
- Mở rộng API với webhook hoặc hệ thống thanh toán.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
