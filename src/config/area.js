const AREA = {
  AnGiang: "An Giang",
  BacNinh: "Bac Ninh",
  CaMau: "Ca Mau",
  CaoBang: "Cao Bang",
  CanTho: "Can Tho",
  DaNang: "Da Nang",
  DakLak: "Dak Lak",
  DienBien: "Dien Bien",
  DongNai: "Dong Nai",
  DongThap: "Dong Thap",
  GiaLai: "Gia Lai",
  HaNoi: "Ha Noi",
  HaTinh: "Ha Tinh",
  HaiPhong: "Hai Phong",
  HoChiMinh: "Ho Chi Minh",
  Hue: "Hue",
  HungYen: "Hung Yen",
  KhanhHoa: "Khanh Hoa",
  LaiChau: "Lai Chau",
  LangSon: "Lang Son",
  LaoCai: "Lao Cai",
  LamDong: "Lam Dong",
  NgheAn: "Nghe An",
  NinhBinh: "Ninh Binh",
  PhuTho: "Phu Tho",
  QuangNgai: "Quang Ngai",
  QuangNinh: "Quang Ninh",
  QuangTri: "Quang Tri",
  SonLa: "Son La",
  TayNinh: "Tay Ninh",
  ThaiNguyen: "Thai Nguyen",
  ThanhHoa: "Thanh Hoa",
  TuyenQuang: "Tuyen Quang",
  VinhLong: "Vinh Long"
};

// Chia theo vùng
const AREA_BY_REGION = {
  Bac: [
    AREA.BacNinh,
    AREA.CaoBang,
    AREA.DienBien,
    AREA.HaNoi,
    AREA.HaiPhong,
    AREA.HaTinh,
    AREA.HungYen,
    AREA.LaiChau,
    AREA.LangSon,
    AREA.LaoCai,
    AREA.NinhBinh,
    AREA.PhuTho,
    AREA.QuangNinh,
    AREA.SonLa,
    AREA.ThaiNguyen,
    AREA.TuyenQuang,
    AREA.ThanhHoa
  ],

  Trung: [
    AREA.DaNang,
    AREA.DakLak,
    AREA.GiaLai,
    AREA.Hue,
    AREA.KhanhHoa,
    AREA.NgheAn,
    AREA.QuangNgai,
    AREA.QuangTri,
    AREA.LamDong
  ],

  Nam: [
    AREA.AnGiang,
    AREA.CaMau,
    AREA.CanTho,
    AREA.DongNai,
    AREA.DongThap,
    AREA.HoChiMinh,
    AREA.TayNinh,
    AREA.VinhLong
  ]
};

export { AREA, AREA_BY_REGION };
