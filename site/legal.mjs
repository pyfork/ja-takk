// Terms of Use + Privacy Notice (PDPA 2010, as amended 2024). One page per language.
// Each section: [heading, [paragraphs...]]. Plain text only; build.mjs escapes it.
// PDPA s.7(3): the notice must exist in BM and English; the BM page is /ms/terma-privasi.
export const CONTACT = 'privacy@veridle.com';
export const UPDATED = '2026-10-14';

// Legal identity (Consumer Protection (Electronic Trade Transactions) Regulations 2012).
export const ENTITY = { name: 'Puascari Property Group', ssm: '', address: '' };

const idEn = [ENTITY.ssm && `Registration no. ${ENTITY.ssm}.`, ENTITY.address && `Address: ${ENTITY.address}.`].filter(Boolean).join(' ');
const idMs = [ENTITY.ssm && `No. pendaftaran ${ENTITY.ssm}.`, ENTITY.address && `Alamat: ${ENTITY.address}.`].filter(Boolean).join(' ');

export const legalEn = {
  path: '/terms-privacy',
  title: 'Terms & Privacy | Puascari',
  description: 'Terms of use and privacy notice for Puascari (veridle.com), written under Malaysia’s Personal Data Protection Act 2010.',
  h: 'Terms & Privacy',
  updated: 'Last updated',
  termsH: 'Terms of use',
  privacyH: 'Privacy notice',
  footerLink: 'Terms & Privacy',
  back: 'Back to home',
  terms: [
    ['Who we are', [
      `Puascari is a tenancy agreement review service at veridle.com, run by ${ENTITY.name}, Malaysia. ${idEn}`.trim(),
      'You can reach us at ' + CONTACT + '.',
      'You accept these terms when you create an account. You do not need an account to read the public pages.',
    ]],
    ['What the service does', ['Puascari reads tenancy agreements you upload and points out clauses worth a second look. It uses AI and can make mistakes. Treat its output as a starting point for your own checks.', 'Puascari is not a law firm and does not give legal advice. For a decision that matters, check with a lawyer.']],
    ['Your account', ['Keep your sign-in details private. You are responsible for what happens under your account. Tell us at once if you think someone else has used it.']],
    ['What you upload', [
      'Only upload documents you have the right to share. You keep ownership of them, and we use them only to provide the service to you.',
      'Tenancy agreements usually contain personal data about other people, such as the other party’s name, IC number and address. For that data we act as your data processor under the PDPA: we process it only to review the document for you. You confirm that you are allowed to share it with us for that purpose.',
      'If a detail is not needed for the review, such as an IC number or bank account number, you may black it out before you upload.',
    ]],
    ['Fair use', ['Do not misuse the service: no attempts to break in, overload it, copy it in bulk, or use it for anything unlawful.']],
    ['Fees', ['Paid plans are billed monthly in Malaysian ringgit. Before you pay, we show the full price, including any tax. You can cancel at any time; the plan runs to the end of the period already paid.']],
    ['Liability', [
      'We provide the service with reasonable care and skill. Because it uses AI, it can miss or misread a clause, so check anything important with a lawyer before you act on it.',
      'If we are liable to you, our total liability for all claims about the service is limited to the fees you paid us in the 12 months before the claim, or RM100 if that is more. We are not liable for indirect loss, such as lost rent or lost profit.',
      'These limits do not apply to loss caused by our fraud or wilful misconduct, or where the law does not allow them. Nothing in these terms limits your rights under the Consumer Protection Act 1999.',
    ]],
    ['Changes', ['We may update these terms and will change the date above when we do. If a change matters to paid users, we will email you at least 14 days before it takes effect, and you may cancel before then.']],
    ['Law and disputes', ['These terms are governed by the laws of Malaysia, and the courts of Malaysia decide disputes about them. If you are a consumer, you may also bring a claim to the Tribunal for Consumer Claims Malaysia.']],
  ],
  privacy: [
    ['Our commitment', [
      'We handle personal data under the Personal Data Protection Act 2010 (PDPA), including the 2024 amendments. This notice is given under section 7 of the PDPA.',
      `${ENTITY.name} is the data controller for your account and technical data. For personal data about other people inside documents you upload, we act as your data processor (see Terms 4).`,
    ]],
    ['What we collect', [
      'Account details: your name, email and sign-in details.',
      'Documents you upload, which may contain personal data about you, your tenants or your landlord, such as names, IC numbers, addresses and rent amounts.',
      'Technical data: IP address, browser type and the time of each request, kept for security and to stop abuse.',
      'We collect account and technical data from you directly. Personal data about other people reaches us only inside documents you upload.',
    ]],
    ['Required or optional', ['You must give your name, email and sign-in details to open an account. Without them we cannot provide the service. Everything else you share with us is your choice.']],
    ['Why we use it', ['To run the service, review your documents, keep your account secure, answer your questions, bill you, and meet our legal duties. We do not sell your data and do not use it for advertising.']],
    ['Who we share it with', [
      'Service providers that help us run Puascari, only as far as needed: our hosting provider; Cloudflare, for network and security; and Anthropic, whose Claude model reads your documents to produce the review. Each may use the data only to provide its service to us and to keep that service secure. Anthropic does not use it to train its models.',
      'Some of these providers process data outside Malaysia. Anthropic is based in the United States and processes documents outside Malaysia, and Cloudflare’s network may route requests through data centres in other countries. We transfer personal data out of Malaysia only where section 129 of the PDPA allows it, under contracts that require the recipient to protect it.',
      'We may also disclose data when the law requires it.',
    ]],
    ['How long we keep it', [
      'Uploaded documents and reviews are kept while your account is active, so you can return to them. You can delete them at any time. When you close your account we delete your data within 30 days, except what the law requires us to keep.',
      'Technical data such as IP addresses is deleted within 30 days, unless we need it to investigate abuse.',
    ]],
    ['Security', ['We use encrypted connections, restricted access and rate limits on sign-in. If a data breach is likely to cause you significant harm, we will notify the Personal Data Protection Commissioner as soon as practicable, normally within 72 hours, and notify you without unnecessary delay, as the PDPA requires.']],
    ['Your rights', ['Under the PDPA you may ask to see the personal data we hold about you, correct it, withdraw consent, limit how we process it, or ask us to send it to another service (data portability). Withdrawing consent may mean we can no longer provide the service.', 'We will reply within 21 days. You may also complain to the Personal Data Protection Commissioner of Malaysia.']],
    ['Cookies', ['We use only the cookies needed to keep you signed in and protect the site. We do not use advertising or tracking cookies.']],
    ['Children', ['Puascari is meant for adults dealing with tenancies. We do not knowingly collect data from anyone under 18.']],
    ['Language', ['This notice is available in English and Bahasa Melayu, as the PDPA requires. If the two differ, the Bahasa Melayu version applies.']],
    ['Contact', ['For any privacy question or request, email our data protection officer at ' + CONTACT + '.']],
  ],
};

export const legalMs = {
  path: '/ms/terma-privasi',
  title: 'Terma & Privasi | Puascari',
  description: 'Terma penggunaan dan notis privasi Puascari (veridle.com), di bawah Akta Perlindungan Data Peribadi 2010 Malaysia.',
  h: 'Terma & Privasi',
  updated: 'Kemas kini terakhir',
  termsH: 'Terma penggunaan',
  privacyH: 'Notis privasi',
  footerLink: 'Terma & Privasi',
  back: 'Kembali ke laman utama',
  terms: [
    ['Siapa kami', [
      `Puascari ialah perkhidmatan semakan perjanjian sewa di veridle.com, dikendalikan oleh ${ENTITY.name}, Malaysia. ${idMs}`.trim(),
      'Anda boleh menghubungi kami di ' + CONTACT + '.',
      'Anda menerima terma ini apabila anda membuka akaun. Anda tidak memerlukan akaun untuk membaca halaman awam.',
    ]],
    ['Apa yang perkhidmatan ini lakukan', ['Puascari membaca perjanjian sewa yang anda muat naik dan menunjukkan klausa yang perlu disemak semula. Ia menggunakan AI dan boleh melakukan kesilapan. Anggap hasilnya sebagai titik permulaan untuk semakan anda sendiri.', 'Puascari bukan firma guaman dan tidak memberi nasihat undang-undang. Untuk keputusan penting, rujuk peguam.']],
    ['Akaun anda', ['Rahsiakan butiran log masuk anda. Anda bertanggungjawab atas apa yang berlaku di bawah akaun anda. Beritahu kami segera jika anda rasa orang lain telah menggunakannya.']],
    ['Apa yang anda muat naik', [
      'Muat naik hanya dokumen yang anda berhak kongsi. Dokumen itu kekal milik anda, dan kami menggunakannya hanya untuk memberi perkhidmatan kepada anda.',
      'Perjanjian sewa biasanya mengandungi data peribadi orang lain, seperti nama, nombor kad pengenalan dan alamat pihak yang satu lagi. Bagi data tersebut, kami bertindak sebagai pemproses data anda di bawah PDPA: kami memprosesnya hanya untuk menyemak dokumen bagi pihak anda. Anda mengesahkan bahawa anda dibenarkan berkongsi data itu dengan kami untuk tujuan tersebut.',
      'Jika sesuatu butiran tidak diperlukan untuk semakan, seperti nombor kad pengenalan atau nombor akaun bank, anda boleh menghitamkannya sebelum memuat naik.',
    ]],
    ['Penggunaan wajar', ['Jangan salah guna perkhidmatan ini: tiada cubaan menceroboh, membebankan, menyalin secara pukal, atau menggunakannya untuk tujuan yang menyalahi undang-undang.']],
    ['Yuran', ['Pelan berbayar dicaj bulanan dalam ringgit Malaysia. Sebelum anda membayar, kami memaparkan harga penuh, termasuk sebarang cukai. Anda boleh membatalkan bila-bila masa; pelan berjalan hingga akhir tempoh yang telah dibayar.']],
    ['Liabiliti', [
      'Kami menyediakan perkhidmatan dengan penjagaan dan kemahiran yang munasabah. Oleh sebab ia menggunakan AI, ia boleh terlepas atau tersalah baca sesuatu klausa, jadi semak perkara penting dengan peguam sebelum anda bertindak.',
      'Jika kami bertanggungjawab kepada anda, jumlah liabiliti kami bagi semua tuntutan berkaitan perkhidmatan ini terhad kepada yuran yang anda bayar kepada kami dalam tempoh 12 bulan sebelum tuntutan, atau RM100, mengikut mana yang lebih tinggi. Kami tidak bertanggungjawab atas kerugian tidak langsung, seperti kehilangan sewa atau keuntungan.',
      'Had ini tidak terpakai bagi kerugian akibat penipuan atau salah laku sengaja kami, atau jika undang-undang tidak membenarkannya. Tiada apa-apa dalam terma ini mengehadkan hak anda di bawah Akta Perlindungan Pengguna 1999.',
    ]],
    ['Perubahan', ['Kami mungkin mengemas kini terma ini dan akan menukar tarikh di atas apabila berbuat demikian. Jika perubahan itu penting kepada pengguna berbayar, kami akan menghantar e-mel sekurang-kurangnya 14 hari sebelum ia berkuat kuasa, dan anda boleh membatalkan sebelum tarikh itu.']],
    ['Undang-undang dan pertikaian', ['Terma ini tertakluk kepada undang-undang Malaysia, dan mahkamah Malaysia memutuskan pertikaian berkaitannya. Jika anda seorang pengguna, anda juga boleh memfailkan tuntutan di Tribunal Tuntutan Pengguna Malaysia.']],
  ],
  privacy: [
    ['Komitmen kami', [
      'Kami mengendalikan data peribadi di bawah Akta Perlindungan Data Peribadi 2010 (PDPA), termasuk pindaan 2024. Notis ini diberikan di bawah seksyen 7 PDPA.',
      `${ENTITY.name} ialah pengawal data bagi data akaun dan data teknikal anda. Bagi data peribadi orang lain dalam dokumen yang anda muat naik, kami bertindak sebagai pemproses data anda (lihat Terma 4).`,
    ]],
    ['Apa yang kami kumpul', [
      'Butiran akaun: nama, e-mel dan butiran log masuk anda.',
      'Dokumen yang anda muat naik, yang mungkin mengandungi data peribadi anda, penyewa atau tuan rumah anda, seperti nama, nombor kad pengenalan, alamat dan jumlah sewa.',
      'Data teknikal: alamat IP, jenis pelayar dan masa setiap permintaan, disimpan untuk keselamatan dan menghalang penyalahgunaan.',
      'Kami mengumpul data akaun dan data teknikal terus daripada anda. Data peribadi orang lain sampai kepada kami hanya melalui dokumen yang anda muat naik.',
    ]],
    ['Wajib atau pilihan', ['Anda mesti memberikan nama, e-mel dan butiran log masuk untuk membuka akaun. Tanpanya, kami tidak dapat memberi perkhidmatan. Selain itu, apa yang anda kongsi dengan kami adalah pilihan anda.']],
    ['Mengapa kami menggunakannya', ['Untuk menjalankan perkhidmatan, menyemak dokumen anda, menjaga keselamatan akaun, menjawab soalan anda, mengebil anda dan memenuhi kewajipan undang-undang kami. Kami tidak menjual data anda dan tidak menggunakannya untuk pengiklanan.']],
    ['Dengan siapa kami berkongsi', [
      'Penyedia perkhidmatan yang membantu kami menjalankan Puascari, setakat yang perlu sahaja: penyedia hosting kami; Cloudflare, untuk rangkaian dan keselamatan; dan Anthropic, yang model Claude-nya membaca dokumen anda untuk menghasilkan semakan. Setiap penyedia hanya boleh menggunakan data untuk memberi perkhidmatannya kepada kami dan menjaga keselamatan perkhidmatan itu. Anthropic tidak menggunakannya untuk melatih modelnya.',
      'Sesetengah penyedia ini memproses data di luar Malaysia. Anthropic berpangkalan di Amerika Syarikat dan memproses dokumen di luar Malaysia, dan rangkaian Cloudflare mungkin menghalakan permintaan melalui pusat data di negara lain. Kami memindahkan data peribadi ke luar Malaysia hanya apabila dibenarkan oleh seksyen 129 PDPA, di bawah kontrak yang mewajibkan penerima melindunginya.',
      'Kami juga mungkin mendedahkan data apabila dikehendaki oleh undang-undang.',
    ]],
    ['Berapa lama kami menyimpannya', [
      'Dokumen dan semakan disimpan selagi akaun anda aktif, supaya anda boleh merujuknya semula. Anda boleh memadamnya bila-bila masa. Apabila anda menutup akaun, kami memadam data anda dalam masa 30 hari, kecuali yang wajib disimpan oleh undang-undang.',
      'Data teknikal seperti alamat IP dipadam dalam masa 30 hari, kecuali jika kami memerlukannya untuk menyiasat penyalahgunaan.',
    ]],
    ['Keselamatan', ['Kami menggunakan sambungan tersulit, akses terhad dan had cubaan log masuk. Jika pelanggaran data mungkin menyebabkan kemudaratan ketara kepada anda, kami akan memaklumkan Pesuruhjaya Perlindungan Data Peribadi secepat mungkin, biasanya dalam masa 72 jam, dan memaklumkan anda tanpa kelewatan yang tidak wajar, seperti yang dikehendaki PDPA.']],
    ['Hak anda', ['Di bawah PDPA, anda boleh meminta untuk melihat data peribadi yang kami simpan tentang anda, membetulkannya, menarik balik persetujuan, mengehadkan pemprosesannya, atau meminta kami menghantarnya kepada perkhidmatan lain (kemudahalihan data). Menarik balik persetujuan mungkin bermakna kami tidak lagi dapat memberi perkhidmatan.', 'Kami akan membalas dalam masa 21 hari. Anda juga boleh membuat aduan kepada Pesuruhjaya Perlindungan Data Peribadi Malaysia.']],
    ['Kuki', ['Kami hanya menggunakan kuki yang perlu untuk mengekalkan log masuk anda dan melindungi laman ini. Kami tidak menggunakan kuki pengiklanan atau penjejakan.']],
    ['Kanak-kanak', ['Puascari ditujukan untuk orang dewasa yang berurusan dengan penyewaan. Kami tidak sengaja mengumpul data daripada sesiapa di bawah umur 18 tahun.']],
    ['Bahasa', ['Notis ini tersedia dalam bahasa Inggeris dan Bahasa Melayu, seperti yang dikehendaki PDPA. Jika terdapat percanggahan, versi Bahasa Melayu terpakai.']],
    ['Hubungi', ['Untuk sebarang soalan atau permintaan privasi, e-mel pegawai perlindungan data kami di ' + CONTACT + '.']],
  ],
};
