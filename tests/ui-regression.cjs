const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
const {chromium}=require(require.resolve('playwright',{paths:[process.env.PLAYWRIGHT_MODULES||process.cwd()]}));
fs.mkdirSync('scratch/seo-admin-qa',{recursive:true});
const base=process.env.QA_BASE_URL||'http://localhost:3045';
function constants(file){const module={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('module','exports',code)(module,module.exports);return module.exports;}
const home=constants('lib/home-content.ts'),catalogue=constants('lib/subcategories-data.ts');
const catalog=JSON.parse(JSON.stringify(catalogue.DEFAULT_HIERARCHICAL_CATEGORIES));
let settings={...home.DEFAULT_HOME_SETTINGS};let savedCatalog;
const category={id:'cat1',name:'Tượng đồng',slug:'tuong-dong'};
const products=Array.from({length:53},(_,i)=>({id:'p'+i,name:'Sản phẩm '+i,slug:'san-pham-'+i,price:1200000,images:'["/images/logo.png"]',material:'Đồng đỏ',categoryId:'cat1',category,inStock:true,isFeatured:false,createdAt:'2026-09-01T00:00:00Z',tags:'',description:'<p>NỘI DUNG GỐC CẦN GIỮ</p>'}));
const article={id:'a1',title:'Bài viết thử nghiệm',slug:'bai-thu-nghiem',summary:'Tóm tắt',content:'<p>NỘI DUNG BÀI VIẾT GỐC</p>',thumbnail:'/images/logo.png',category:'KIẾN THỨC ĐỒ ĐỒNG',isPublished:true,publishedAt:'2026-09-01T00:00:00Z'};
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 await context.addCookies([{name:'admin_token',value:'isolated-ui-fixture',url:base}]);
 const page=await context.newPage();const errors=[];let unexpectedSaves=0;
page.on('pageerror',err=>{ errors.push(err.message); console.log('PAGE ERROR:',err.message); });
 page.on('console', msg=>{if(msg.type()==='error' && /hydration|cannot be a descendant/i.test(msg.text()))errors.push(msg.text());});
 await page.route('**/api/admin/**',async route=>{
  const req=route.request(),url=new URL(req.url());let data={success:true};
  if(url.pathname.endsWith('/auth/me'))data.user={id:'qa',name:'Kiểm thử',role:'ADMIN',permissions:['landing','categories','products','articles']};
  else if(url.pathname.endsWith('/subcategories')){if(req.method()==='POST')savedCatalog=req.postDataJSON().catalog;data.data=savedCatalog||catalog;}
  else if(url.pathname.endsWith('/categories'))data.categories=[category];
  else if(url.pathname.endsWith('/landing-page')){if(req.method()==='POST')settings={...settings,...req.postDataJSON().settings};data.settings=settings;}
  else if(url.pathname.endsWith('/products')){if(req.method()!=='GET')unexpectedSaves++;if(url.searchParams.has('id'))data.product=products.find(p=>p.id===url.searchParams.get('id'));else data.products=products.map(({description,...p})=>p);}
  else if(url.pathname.endsWith('/articles')){if(url.searchParams.has('id'))data.article=article;else data.articles=[{...article,content:undefined}];}
  else if(url.pathname.endsWith('/images'))data={success:true,images:[{url:'/images/logo.png',name:'Logo chuẩn',source:'Ảnh có sẵn'}],total:1,pageCount:1,page:1};
  else if(url.pathname.endsWith('/orders'))data={success:true,count:0,orders:[]};
  else if(url.pathname.endsWith('/videos'))data.videos=[];
  await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
 });
 await page.route('**/api/settings',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,settings})}));
 await page.route('**/api/subcategories',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,data:catalog})}));
 await page.route('**/googletagmanager.com/**',route=>route.abort());
 await page.goto(base+'/admin/categories');
 await page.getByLabel('Tên danh mục hiển thị',{exact:true}).fill('Danh mục đã đổi tên');
 await page.getByLabel('Tiêu đề SEO (để trống để tạo tự động)',{exact:true}).fill('Tiêu đề SEO thử nghiệm');
 await page.getByRole('button',{name:'Lưu Tất Cả Thẻ Con',exact:true}).click();
 await page.waitForFunction(()=>document.body.innerText.includes('Đã lưu toàn bộ'));
 assert.equal(savedCatalog.find(c=>c.slug==='tranh-dong').name,'Danh mục đã đổi tên');
 await page.screenshot({path:'scratch/seo-admin-qa/categories-desktop.png',fullPage:false});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'scratch/seo-admin-qa/categories-mobile.png',fullPage:false});
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(base+'/admin/landing-page#home-categories');
 const editor=page.locator('#home-categories');await editor.getByRole('combobox').selectOption('tranh-dong');
 await editor.getByRole('button',{name:'Thêm danh mục',exact:true}).click();
 assert.equal(await editor.locator('label').filter({hasText:'Tiêu đề'}).count(),7);
 await editor.getByLabel('Tiêu đề',{exact:true}).last().fill('Danh mục trang chủ mới');
 await page.getByRole('button',{name:/Lưu \d+ Thay Đổi/}).click();
 await page.waitForFunction(()=>document.body.innerText.includes('Đã lưu toàn bộ cài đặt'));
 assert.equal(JSON.parse(settings.home_featured_categories).length,7);
 assert.equal(JSON.parse(settings.home_featured_categories)[6].title,'Danh mục trang chủ mới');
 await editor.scrollIntoViewIfNeeded();await page.screenshot({path:'scratch/seo-admin-qa/home-editor-desktop.png',fullPage:false});
 await page.setViewportSize({width:390,height:844});await editor.scrollIntoViewIfNeeded();await page.screenshot({path:'scratch/seo-admin-qa/home-editor-mobile.png',fullPage:false});
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(base+'/admin/products');await page.waitForSelector('tbody tr');assert.equal(await page.locator('tbody tr').count(),40);
 await page.getByRole('button',{name:'Trang sau',exact:true}).click();assert.equal(await page.locator('tbody tr').count(),13);
 await page.getByTitle('Chỉnh sửa sản phẩm',{exact:true}).first().click();await page.waitForFunction(()=>document.body.innerText.includes('NỘI DUNG GỐC CẦN GIỮ'));
 assert.equal(await page.locator('form form').count(),0);
 const tagInput=page.getByPlaceholder('Nhập thẻ, cách nhau bằng dấu phẩy...');
 await tagInput.fill('Thẻ một, Thẻ hai');await tagInput.press('Enter');
 await page.getByText('Thẻ một',{exact:true}).waitFor();await page.getByText('Thẻ hai',{exact:true}).waitFor();
 assert.equal(unexpectedSaves,0,'Adding tags must not submit the outer product form');

 await page.goto(base+'/admin/articles');await page.waitForSelector('tbody tr');
 await page.getByTitle('Chỉnh sửa',{exact:true}).first().click();
 await page.waitForFunction(()=>document.body.innerText.includes('NỘI DUNG BÀI VIẾT GỐC'));
 await page.goto(base+'/admin/images');await page.getByText('Logo chuẩn',{exact:true}).waitFor();
 const img=page.locator('main img');await img.waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('main img')].every(img=>img.complete&&img.naturalWidth>0));
 assert.equal(await img.getAttribute('src'),'/images/logo.png');await page.screenshot({path:'scratch/seo-admin-qa/images-desktop.png',fullPage:false});
 assert.deepEqual(errors,[]);console.log('UI PASS: category name/SEO edit, homepage add/save, 40-row pagination, intact product/article editor content, image previews; desktop/mobile screenshots.');
 await browser.close();
})().catch(err=>{console.error(err);process.exit(1);});
