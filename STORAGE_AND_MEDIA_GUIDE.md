# საცავი და მედია

ეს დოკუმენტი აღწერს როგორ ინახება საიტის მონაცემები და რატომ არის ფოტო ატვირთვა გამორთული ნაგულისხმევად.

## მიმდინარე საცავი

- საიტის runtime მონაცემები ინახება SQLite ბაზაში.
- ნაგულისხმევი ლოკალური გზა არის `data/store.sqlite`.
- CMS-ის ცვლილებები ინახება იმავე SQLite ბაზაში, `clinic_content` ცხრილში.
- ჩაწერის მოთხოვნებიც ინახება SQLite-ში, მაგრამ საჯარო API მათ არ აბრუნებს.

## რატომ არის backup მნიშვნელოვანი

Admin CMS-ში გაკეთებული ტექსტური ცვლილებები შეიძლება დაიკარგოს, თუ production გარემოში SQLite ფაილი არ დევს persistent disk-ზე ან გარე მონაცემთა ბაზაში. დიდი deploy-ის ან ფართო ცვლილების წინ admin-მა უნდა ჩამოტვირთოს JSON backup ღილაკით `კონტენტის ექსპორტი`.

## DATA_DIR და database path

ლოკალურად დამატებითი კონფიგურაცია საჭირო არ არის. production-ზე მომავალი persistent storage-ისთვის შესაძლებელია:

```env
DATA_DIR=/var/data/virera
DATABASE_PATH=/var/data/virera/store.sqlite
```

ასევე მხარდაჭერილია `SQLITE_PATH`, თუ hosting გარემო ამ სახელს იყენებს. თუ `DATABASE_PATH` ან `SQLITE_PATH` არ არის მითითებული, აპი გამოიყენებს `DATA_DIR/store.sqlite`-ს. თუ არც `DATA_DIR` არის მითითებული, დარჩება ნაგულისხმევი `data/` საქაღალდე.

## ფოტო ატვირთვა

ფოტო ატვირთვა ნაგულისხმევად გამორთულია. ეს იცავს საიტს შემთხვევითი ატვირთვებისგან ephemeral storage-ზე.

ჩასართავად საჭიროა ორივე:

```env
MEDIA_UPLOAD_ENABLED=true
MEDIA_UPLOAD_DIR=/var/data/virera/uploads
```

ჩართული რეჟიმი დაცულია admin ავტორიზაციით და იღებს მხოლოდ:

- JPEG
- PNG
- WebP
- მაქსიმუმ 3MB

არ მიიღება SVG, HTML, scripts, executables, external URL, data URL ან path traversal.

## რეკომენდებული production ვარიანტები

- Render persistent disk SQLite ფაილისა და uploads საქაღალდისთვის.
- Cloudflare R2, S3 ან Cloudinary მედია ფაილებისთვის.
- გარე database CMS კონტენტის და appointment მოთხოვნების უფრო მდგრადი შენახვისთვის.

## Admin რჩევა

სანამ persistent storage საბოლოოდ ჩაირთვება, რეალურ კონტენტზე მუშაობისას რეგულარულად ჩამოტვირთეთ JSON backup. ფოტოებისთვის ამ ეტაპზე გამოიყენეთ არსებული `/assets/` სურათები ან დაელოდეთ მუდმივი media storage-ის კონფიგურაციას.
