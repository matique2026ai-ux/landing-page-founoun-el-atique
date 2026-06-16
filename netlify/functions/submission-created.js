exports.handler = async function(event, context) {
  // Only trigger on form submissions
  try {
    const { payload } = JSON.parse(event.body);
    const data = payload.data;
    
    const email = data.email ? data.email.trim() : null;
    const fullname = data.fullname ? data.fullname.trim() : 'المشارك الكريم';
    const exhibitorName = data.exhibitor_name ? data.exhibitor_name.trim() : 'غير محدد';
    const wilaya = data.wilaya ? data.wilaya.trim() : 'غير محدد';
    const commune = data.commune ? data.commune.trim() : 'غير محدد';
    const phone = data.phone ? data.phone.trim() : 'غير محدد';
    const socialLink = data.social_link ? data.social_link.trim() : 'غير محدد';
    
    // Process categories checkboxes
    const categoriesList = [];
    if (data.category_furniture === 'on') categoriesList.push('أثاث وديكورات عتيقة');
    if (data.category_kitchenware === 'on') categoriesList.push('أواني ونحاسيات');
    if (data.category_jewelry === 'on') categoriesList.push('ساعات ومجوهرات');
    if (data.category_documents === 'on') categoriesList.push('وثائق ومخطوطات');
    if (data.category_art === 'on') categoriesList.push('لوحات فنية وصور');
    if (data.category_devices === 'on') categoriesList.push('أجهزة كلاسيكية');
    if (data.category_other === 'on') {
      const otherText = data.category_other_text ? data.category_other_text.trim() : '';
      categoriesList.push(otherText ? `أخرى: ${otherText}` : 'أخرى');
    }
    const category = categoriesList.length > 0 ? categoriesList.join(' · ') : 'غير محدد';

    // Process space requirement
    let space = data.space_requirement || 'غير محدد';
    if (space === 'مساحة أرضية مخصصة للقطع الكبيرة والأثاث' && data.floor_space_dims) {
      space += ` (أبعاد: ${data.floor_space_dims})`;
    }

    const electricity = data.electricity || 'غير محدد';
    const accomm = data.accomm || 'غير محدد';

    if (!email) {
      console.log('No email address provided in submission. Skipping email dispatch.');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "No email provided, skipped email." })
      };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY environment variable is not configured.');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Resend API key is not configured." })
      };
    }

    // Beautiful HTML template in Arabic
    const htmlContent = `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e7e1d8; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background-color: #fff;">
      <div style="background: linear-gradient(135deg, #2d5c3a, #1f4228); padding: 30px; text-align: center; color: #fff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #fff;">أيام فنون العتيق 2026</h1>
        <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px; color: #fff;">سطيف: 04 — 07 جويلية 2026</p>
      </div>
      <div style="padding: 30px; color: #4a3e3d; line-height: 1.8; text-align: right;">
         <h3 style="color: #2d5c3a; margin-top: 0; font-size: 18px;">مرحباً بك يا ${fullname}،</h3>
        <p>لقد تلقينا طلب تسجيلك في أيام <strong>فنون العتيق</strong> بنجاح. ستقوم اللجنة المنظمة بدراسة طلبكم، وسيتم الاتصال بالمشاركين المقبولين فقط لتأكيد مشاركتهم النهائية.</p>
        
        <div style="background-color: #fcfbfa; border: 1px solid #f3efea; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h4 style="margin-top: 0; border-bottom: 1px solid #e7e1d8; padding-bottom: 8px; color: #8c3a1c; font-size: 16px;">تفاصيل التسجيل المستلمة:</h4>
          <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #8c7b70; width: 150px;">الاسم الكامل:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #4a3e3d;">${fullname}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8c7b70;">اسم العارض/الصفة:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #4a3e3d;">${exhibitorName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8c7b70;">ولاية الإقامة:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #4a3e3d;">${wilaya} (بلدية ${commune})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8c7b70;">رقم الهاتف:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #4a3e3d;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8c7b70;">صفحة التواصل الاجتماعي:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #4a3e3d;">${socialLink}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8c7b70;">تصنيف المقتنيات:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #4a3e3d;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8c7b70;">المساحة المطلوبة:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #4a3e3d;">${space}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8c7b70;">الربط الكهربائي:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #4a3e3d;">${electricity}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #8c7b70;">ضمان المبيت (خارج سطيف):</td>
              <td style="padding: 6px 0; font-weight: bold; color: #4a3e3d;">${accomm}</td>
            </tr>
          </table>
        </div>

        <p style="background-color: #fff8f5; border-right: 4px solid #8c3a1c; padding: 12px; border-radius: 4px; font-size: 14px; color: #8c3a1c;">
          <strong>تنبيه هام:</strong> يرجى التأكد من إرسال صورة بطاقة التعريف وصور المعروضات عبر حساب الواتساب الخاص بالمعرض لدراسة طلبكم. يرجى العلم أن المبيت مخصص للمشاركين من خارج الولاية بمفردهم فقط وهو خاضع للقبول الفني، كما ننوه بأن الإطعام والوجبات على عاتق المشارك بالكامل طيلة أيام التظاهرة.
        </p>

        <div style="text-align: center; margin: 30px 0 10px;">
          <a href="https://wa.me/213558507778" style="background-color: #25D366; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; display: inline-block; font-size: 15px;">
            التواصل عبر الواتساب لتأكيد الصور
          </a>
        </div>
      </div>
      <div style="background-color: #f3efea; padding: 15px 30px; text-align: center; font-size: 12px; color: #8c7b70; border-top: 1px solid #e7e1d8;">
        جمعية إبزيم للثقافة والمواطنة · المتحف العمومي الوطني سطيف<br>
        تحت إشراف وزارة الثقافة والفنون الجزائرية
      </div>
    </div>
    `;

    // Sending via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Days of Founoun Al-Atiq <onboarding@resend.dev>', // If they verify their domain on Resend, they can change this to: 'أيام فنون العتيق <info@yourdomain.com>'
        to: [email],
        subject: 'تم استلام طلب تسجيلك في أيام فنون العتيق 2026',
        html: htmlContent
      })
    });

    const resData = await response.json();

    if (response.ok) {
      console.log(`Email sent successfully to ${email}. Message ID: ${resData.id}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email sent successfully", id: resData.id })
      };
    } else {
      console.error('Failed to send email via Resend API:', resData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Failed to send email", details: resData })
      };
    }
  } catch (err) {
    console.error('Error in submission-created function:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
