### 1. Hook vs Context — khi nào dùng cái nào?

- 1.1 **Hook** 
  + là cách gọi** (convention đặt tên `useXxx`)  
  + Mỗi nơi gọi có bản **độc lập** của riêng nó
  + bên trong nó có thể gọi useContext(), useState(), hay useQuery() tuỳ bài toán.
- 1.2 **Context**
  + Share state global: toast, modal xác nhận, theme, user đăng nhập...
  + phải có Context (Provider) đứng sau
