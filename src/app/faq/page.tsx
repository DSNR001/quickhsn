export default function FAQPage() {
  return (
    <main className="min-h-screen px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          Frequently Asked Questions
        </h1>

        <p className="text-center text-gray-600">
          Common questions about HSN codes, GST rates, and QuickHSN usage.
        </p>

        <div className="space-y-6">

          <div className="rounded-xl border p-3 shadow-sm2">
            <h2 className="font-semibold text-lg">
              What is Quickhsn.in ?
            </h2>
            <p className="mt-2 text-gray-700 text-justify">
              This is a web-based tool designed to help businesses, accountants, and GST 
              practitioners in India quickly to find HSN (Harmonized System of Nomenclature)
              codes and related GST information. This is a knowledge / information based place
              to acquie the information and maku use of the tools available to make your work 
              easy and fast. However, it is not replacement for official / professional advice.

            </p>
          </div>

           <div className="rounded-xl border p-3 shadow-sm2">
            <h2 className="font-semibold text-lg">
              How to search on 'Quickhsn.in' ?
            </h2>
            <p className="mt-2 text-gray-700 text-justify">
              Search can be done either by way of entering the product name Ex. Milk, Sugar, Cement, 
              Samrtphone and so on,  or by way of entering the HSN code (either 4, 6 or 8 digit)
              Ex. 22029030, 84806000 or 8480, 848060 etc., You will get the details of 4, 6 and 8 digit
              HSN codes and Description of the product as well as GST Rate. You can copy and share the
              HSN code through Whatsapp, Telegram etc., There is an in-built GST calculator for each 
              8 digit HSN code. You can get the product wise sub-totals, SGST, CGST, IGST details,
              and Invoice amount on the spot.
              
            </p>
          </div>
          
          <div className="rounded-xl border p-3 shadow-sm2">
            <h2 className="font-semibold text-lg">
              What are the different services / tools available on Quickhsn.in ?
            </h2>
            <p className="mt-2 text-gray-700 text-justify">
              Apart from the Search by product name or known HSN codes, QuickHSN provides valuable information
              pertainig to the various topics of GST, Nofitifications & circlars of the Government. Further
              there are (5) quick tools such as Generate GST Invoice, GST Calculator, Find GSTIN, Check IFSC,
              and Search PIN (Postal Index Number) to provide needy services to the users.
            </p>
          </div>

          <div className="rounded-xl border p-5 shadow-sm2">
            <h2 className="font-semibold text-lg">
              How much does it cost to seek information?
            </h2>
            <p className="mt-2 text-gray-700">
              At present all the information on this website is free. Any one take any information for
              any number of times. There is no cost for seeking any information on this site,for any number of times.
           </p>
          </div>

          <div className="rounded-xl border p-5 shadow-sm">
  <h2 className="font-semibold text-lg">
    How to generate GST Invoice using the Generate GST Invoice tool?
  </h2>
  <p className="mt-2 text-gray-700 text-left">
    You can generate a GST Invoice by following the steps as under:
  </p>
  <ol className="mt-2 text-gray-700 text-left list-decimal list-inside pl-2 space-y-2">
    <li>Click the Generate GST Invoice button on site.</li>
    <li>On the next page, fill up your (supplier) detais and client (purchaser) details carefully, in the respective boxes.</li>
    <li>You can add your business / company logo with the help of the "Upload Logo" button provided at the top.</li>
    <li>Put the Invoice number and date in the boxes meant for.</li>
    <li>Enter the Description of the items, HSN code, Quantity, Rate, Discout (if any), & GST rate.</li>
    <li>If you want you can add another line for the sold products.</li>
    <li>You will have an automated pre-view of the Invoice you have been prepared.</li>
    <li>After getting satisfied with the pre-view, you can press print button to get the print of the said invoice.</li>
    <li>Or you can save it as pdf on your system or mobile phone and share it subsequently to anyone you wish to.</li>
  </ol>
</div>

        <div className="rounded-xl border p-5 shadow-sm">
  <h2 className="font-semibold text-lg">
    How to use GST Calculator ?
  </h2>
  <p className="mt-2 text-gray-700 text-left">
    Click the GST calculator buttion on the site.
  </p>
  <ol className="mt-2 text-gray-700 text-left list-decimal list-inside pl-2 space-y-2">
    <li>You will see two Panels / sections on the next page, One gray and another white.</li>
    <li>On the gray panel, enter the Quantity (up to 4 decimals) and enter the Rate (up to 2 decimals).</li>
    <li>You will automatically get the subtotal.</li>
    <li>Next click "Use Amount' button. Your amount is carried to the next feild called 'Base / Taxable amount.</li>
    <li>Here you have two sections with two subsections each.</li>
    <li>If you want add GST to the above amount use "GST Exclusive" section with "Intra-state" tab (for outside the state supply) and "Inter-State" (for within the sate supply).</li>
    <li>Select the appropriate tax slab. That's all, you can see your calculation details on the side panel.</li>
    <li>If your amount is inclusive of GST use "GST Inclusive" section with "Intra-state" tab (for outside the state supply) and "Inter-State" (for within the sate supply).</li>
    <li>Select the appropriate tax slab. That's all, you can see your calculation details on the side panel.</li>
  </ol>
</div>

<div className="rounded-xl border p-5 shadow-sm">
  <h2 className="font-semibold text-lg">
    How to search Tax Payer's GSTIN (OR) REGISTRATION PROFILE ?
  </h2>
  <p className="mt-2 text-gray-700 text-left">
    Click the GSTIN buttion on the site.
  </p>
  <ol className="mt-2 text-gray-700 text-left list-decimal list-inside pl-2 space-y-2">
    <li>You can search Tax Payer's GSTIN PROFILE with HIS GSTIN (or) GSTIN with his PAN number.</li>
    <li>Accordingly two tabs are provided. click the tabs you wish to search. </li>
    <li>Just below these tabs, a link is provided in red color. Click this link to see the "How to use" instructions. </li>
    <li>Read & follow the instructions carefully. Your will get the details.</li>
      </ol>
</div>

<div className="rounded-xl border p-5 shadow-sm">
  <h2 className="font-semibold text-lg">
    How to check IFSC codes and Other details of the Banks ?
  </h2>
  <p className="mt-2 text-gray-700 text-left">
    Click the Check IFSC tab on the site, which leads to a next page. 
  </p>
  <ol className="mt-2 text-gray-700 text-left list-decimal list-inside pl-2 space-y-2">
    <li>You will find two tabs, one to find the IFSC detais and another to find the Bank details when you know the IFSC number. </li>
    <li>Read the instructions on the screen carefully and follow them.</li>
   </ol>
</div>

<div className="rounded-xl border p-5 shadow-sm">
  <h2 className="font-semibold text-lg">
    How to check the PIN of any Post Office ?
  </h2>
  <p className="mt-2 text-gray-700 text-left">
    Click the PIN search buttion on the site. 
  </p>
  <ol className="mt-2 text-gray-700 text-left list-decimal list-inside pl-2 space-y-2">
    <li>On the next page, enter the pin code of any place in India and hit search button. You will get the details petaining to that pin code.</li>
    <li>Alternately you can type the name of any place in India to get the Postal details of that place.</li>
    <li>If you don't find the PIN of any place, change the spelling of the place and try again.</li>
   </ol>
</div>

            <div className="rounded-xl border p-3 shadow-sm2">
            <h2 className="font-semibold text-lg">
              What is GST? 
            </h2>
            <p className="mt-2 text-gray-700 text-justify">
              Goods and Services Tax (GST) is an unique tax levied by Govt. of India, on all goods purchased and services received. This is an idirect tax
              unlike Income tax. GST is implemented under One Nation, One Tax regime policy of Indian Govt. GST replaced many regional taxes levied by the 
              State Govt. and Central Govt. GST is a destination based tax, which means the tax is collected by the state where the goods are consumed or 
              services are received.
            </p>
          </div>
          
        </div>
      </div>
    </main>
  );
}