# SorguNeydi Projesi - Başlangıç Planı

## Başlangıç İçin Minimum Gereksinimler

### Aşama 1: Temel Veritabanı Bağlantısı (1-2 hafta)
- [x] JSON dosyasında veritabanı bağlantılarını saklama (PostgreSQL veritabanında saklanıyor)
- [x] MySQL bağlantısı oluşturma ve test etme
- [x] Bağlantı listesi görüntüleme ve düzenleme ekranı
- [x] Basit bağlantı testi yapma

### Aşama 2: Basit Sorgu Çalıştırma (1 hafta)
- [x] Seçilen bağlantıya manuel SQL gönderme
- [x] Sorgu sonuçlarını tablo olarak gösterme
- [x] Hata yönetimi ve basit loglama
- [ ] Geçmiş sorguları dosyada saklama

### Aşama 3: Şema Bilgilerini Görüntüleme (1 hafta)
- [x] Veritabanındaki tabloları listeleme
- [x] Tablo yapısını (sütunlar, veri tipleri) getirme
- [ ] Tablodaki örnek verileri önizleme
- [x] Şema bilgilerini ağaç yapısında gösterme (Accordion kullanılıyor)

### Aşama 4: Basit Görsel Sorgu Oluşturucu (2 hafta)
- [x] Tablo seçme arayüzü
- [x] Sütun seçme (SELECT kısmı)
- [x] Basit filtreleme (WHERE kısmı)
- [x] Görsel sorgulardan SQL kodu üretme (sütun seçimi için)

## Yapılan İyileştirmeler ve Ek Özellikler
- [x] Modüler yapı (component, hooks, services)
- [x] Tema sistemi
- [x] Uygulamada navigation bar
- [x] PostgreSQL ve MySQL desteği
- [x] Oracle veritabanı için destek eklendi
- [x] Material UI ile modern arayüz
- [x] Responsive tasarım iyileştirmeleri
- [x] Sorgu temizleme butonu

## Gelecek İyileştirmeler
- [ ] Geçmiş sorgu yönetimi
- [ ] Sorgu sonuçlarını dışa aktarma (CSV, Excel)
- [x] Filtreleme, sıralama ve gruplama için görsel arayüz
- [ ] Şema bilgilerini görselleştirme
- [ ] İlişkisel diyagramlar

# SorguNeydi - Yapılacaklar Listesi

## SQL Görsel Sorgu Oluşturucu Özellikleri

### Temel Özellikler
- [x] Veritabanı bağlantısı oluşturma ve yönetme
- [x] Tablo ve sütunları görüntüleme
- [x] Basit SELECT sorguları oluşturma
- [x] Sorgu çalıştırma ve sonuçları görüntüleme
- [x] Sonuçlarda sayfalama

### İleri Düzey Sorgu Özellikleri
- [x] Tablo Birleştirme (JOIN) işlemleri
  - [x] INNER JOIN desteği
  - [x] LEFT JOIN desteği
  - [x] RIGHT JOIN desteği
  - [x] FULL JOIN desteği
  - [x] JOIN koşullarını görsel olarak oluşturma
  - [x] JOIN'leri sorguya uygulama

- [x] Gruplama (GROUP BY) işlemleri
  - [x] Tablolardan sütun seçerek GROUP BY oluşturma
  - [x] GROUP BY ifadelerini sorguya uygulama
  - [x] Aktif gruplama kriterlerini gösterme

- [x] Sıralama (ORDER BY) işlemleri
  - [x] Tablolardan sütun seçerek ORDER BY oluşturma
  - [x] Artan (ASC) ve azalan (DESC) sıralama seçenekleri
  - [x] ORDER BY ifadelerini sorguya uygulama
  - [x] Aktif sıralama kriterlerini gösterme

- [x] SQL Fonksiyonları
  - [x] Toplama fonksiyonları (COUNT, SUM, AVG, MIN, MAX)
  - [x] Metin işleme fonksiyonları
  - [x] Tarih işleme fonksiyonları
  - [x] Koşullu ifadeler (CASE WHEN)

### Filtre ve Koşullar
- [x] WHERE koşulları oluşturma
- [x] Farklı operatörler ile filtre ekleme (=, >, <, LIKE, vb.)
- [ ] HAVING koşulları (GROUP BY ile birlikte)

### Kullanıcı Arayüzü İyileştirmeleri
- [x] Çoklu sekme ile farklı sorgu özelliklerine erişim
- [x] Sürükle-bırak etkileşimleri
- [ ] Otomatik SQL tamamlama
- [ ] Sorgu geçmişi
- [ ] Sorguları kaydetme ve yükleme
- [x] Sorgu temizleme butonu

### Performans ve Güvenlik
- [ ] Uzun süren sorgular için zaman aşımı kontrolü
- [ ] SQL enjeksiyon koruması
- [ ] Kullanıcı yetkilendirme sistemi
- [ ] Hassas sorguların şifrelenmesi

## Genel Uygulama Özellikleri
- [x] Responsive tasarım (mobil uyumluluk)
- [ ] Koyu tema desteği
- [ ] Çok dilli arayüz
- [ ] Erişilebilirlik iyileştirmeleri
- [ ] Çevrimdışı çalışma modu
