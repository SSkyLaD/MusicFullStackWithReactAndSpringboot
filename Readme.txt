Trong Java Spring, khái niệm Filter = với Middleware trong các ngôn ngữ khác.

Kiến trúc của SpringSecurity có thể chia thành các Filter với mô hình như sau:
Client ->[Filter1 -> Filter2 -> … -> Filter N]-> Servlet -> Application (Controller, Service, Repository)

Custom Filter được sử dụng trong một số tình huống:
+ Tạo Log các request và response
+ Chỉnh sửa Header và các Parameter của các request
+ Thực thi một số xác thực nhất định
+ Tích hợp các hệ thống xác thực

Phân biệt interface Filter sử dụng doFilter(ServletRequest, ServletResponse) và class OncePerRequestFilter(HttpServletRequest, HttpServletResponse)

Vì ServletReq và ServletRes là một Stream nên chỉ có thể đọc được một lần, vì vậy muốn xử lý ở Filter cần Cache lại data để có thể sử dụng

ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

filterChain.doFilter(wrappedRequest, wrappedResponse);

2024-08-26
Ý tưởng về Session managerment(Đợi làm xong hệ thống OTP): 
Thu thập các thông tin về device như: Time Zone, Browser Language, userAgent, screen information, GPU và CPU core để tạo ra một deviceID, được lưu ở DB khi người dùng đăng nhập vào hệ thống, khi các thông tin này không trùng khớp, 

Tích hợp email vào ứng dụng xây dựng OTP:

1) Yêu cầu xác thực mã OTP gửi về Email khi thực hiện hành động đăng nhập (Mã OTP có thời gian hết hạn là 2 phút), khi đăng nhập, màn hình nhập OTP sẽ hiện lên cùng thời gian đếm ngược, sau 2 phút cho phép thực hiện gửi lại mã OTP. Khi nhập mã OTP thành công, trả về token.

2) Khi yêu cầu đổi mật khẩu, yêu cầu mã OTP được gửi về Email. Yêu cầu đổi mk: B1 mật khẩu cũ trùng nhập đúng(Server check), B2 mật khẩu mới nhập trùng 2 lần (Client check), b3 nhập OTP đúng (Server Check) 

3) Khi yêu cầu xóa tài khoản, các bước gần như trên với đổi mật khẩu

2024-08-27
Disable tạm thời CheckSumFilter

PreAuth dùng CheckSumFilter

PostAuth dùng FingerPrint

Web FingerPrint bao gồm: ClientCode|timezone|browserLang|userAgent|width|height|colorDepth|renderer|cpuCore|.

Gửi mẫ OTP khi đăng nhập, gửi kèm fingerPrint khi gửi mã OTP đăng nhập thành công lưu fingerPrint vào DB, bất kì request nào về sao đều phải gửi kèm với fingerPrint, nếu lệch với fingerPrint đã lưu ở DB cho user thì báo về Client đăng xuất TK. 

Logout xóa FingerPrint ở DB

2024-09-06
Loại bỏ CheckSumFilter, chuyển thành fingerPrint.
Tạo bảng mới UserOtp


2024-09-13
Commit bản mới lên git, tiếp tục nghiên cứu tạo webFingerPrint có bảo mật cao hơn

Tạo filter FingerPrint ở Backend, fingerPrint sẽ được gán ở header (kể tử aut/login/verification), trước khi vào controller, nếu FingerPrint không hợp lệ, trả về fingerPrint không hợp lệ, Khi login thành công, FingerPrint được lưu ở DB, Khi bất cứ có request nào lệch fingerPrint, trả vể mismatch, 


2024-09-23
Hoàn thành thêm fingerprint filter ở service 
TODO : Frontend - Xử lý logout khi concurrent using -DONE( không cần thiết)-
		- Thêm chức năng cho phần nhập OTP 
       Backend - Xử lý expire token -DONE-

2024-09-24
Đã ghép thành công phần concurrent using 
Gửi Fingerprint mỗi lần request tương đối tồi do sau khi load lần đầu thì phần lơn data đã bị cache lại ở Frontend dẫn đến Frontend không cần thiết phải thực hiện thêm req => không ổn lắm

TODO xử lý expire token với code 445 ở Frontend
	xử lý encode các fingerprint để sử dụng thêm khi gửi req stream 

2024-09-30