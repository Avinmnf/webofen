import Image from "next/image";
import Popularpills from "@/components/popularpills";
import Pathsection from "@/components/pathsection";
import Commentsabtus from "@/components/commentsabtus";
import Reservetime from "@/components/reservetime";
export default function Home() {



  return (
    <main>
      <section className="bg-[#f7f8fc] flex justify-center">
        <div className="flex flex-col lg:flex-row w-11/12 justify-center items-center gap-2 md:gap-8">

          {/* Main Image */}
          <div className="relative w-full lg:w-3/5 aspect-[16/9] rounded-lg overflow-hidden">
            <Image
              src="/homepage/slider.png"
              alt="Main slide"
              fill
              className="object-contain"
              priority
            />
            <button
              className="absolute md:text-[1.2vw] text-sm md:rounded-[1.2rem] rounded-lg"
              style={{
                bottom: "6%",
                width: "27%",
                height: "16%",
                backgroundColor: "#6FD6E5",
                color: "#fff",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              خدمات درمانی
            </button>
          </div>

          {/* Side Image - Mobile Version */}
          <div className="relative w-full aspect-[9/3] rounded-lg overflow-hidden lg:hidden">
            <Image
              src="/homepage/sideslidemobile.png"
              alt="Side slide mobile"
              fill
              className="object-contain"
              priority
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 71.21 71.21"
              className="absolute md:rounded-r-3xl md:rounded-tl-3xl rounded-r-xl rounded-tl-xl"
              style={{
                left: '0%',
                bottom: '3%',
                width: '11%',
                height: 'auto',
                backgroundColor: '#1d546b',
                padding: '1.9%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <path
                fill="#fff"
                d="M62.31,56.48v-17.91c0-14.73-11.98-26.7-26.7-26.7s-26.7,11.98-26.7,26.7v17.91C3.88,57.21,0,61.54,0,66.76
    c0,2.45,2,4.45,4.45,4.45h62.31c2.45,0,4.45-2,4.45-4.45c0-5.22-3.88-9.56-8.9-10.28ZM11.87,38.57
    c0-13.09,10.65-23.74,23.74-23.74s23.74,10.65,23.74,23.74v17.8H11.87v-17.8ZM66.76,68.25H4.45c-.82,0-1.48-.67-1.48-1.48
    c0-4.09,3.33-7.42,7.42-7.42h50.44c4.09,0,7.42,3.33,7.42,7.42C68.24,67.58,67.57,68.25,66.76,68.25ZM50.6,6.75l2.97-5.93
    c.37-.73,1.26-1.03,1.99-.66c.73.37,1.03,1.26.66,1.99l-2.97,5.93c-.26.52-.79.82-1.33.82c-.22,0-.45-.05-.66-.16
    c-.73-.37-1.03-1.26-.66-1.99h0ZM62.75,17.37c-.58-.58-.58-1.52,0-2.1l5.93-5.93c.58-.58,1.52-.58,2.1,0s.58,1.52,0,2.1
    l-5.93,5.93c-.29.29-.67.43-1.05.43s-.76-.15-1.05-.43h0ZM14.99,2.15c-.36-.73-.07-1.62.66-1.99s1.62-.07,1.99.66l2.97,5.93
    c.36.73.07,1.62-.66,1.99c-.21.11-.44.16-.66.16c-.54,0-1.07-.3-1.33-.82l-2.97-5.93h0ZM.43,11.44c-.58-.58-.58-1.52,0-2.1
    s1.52-.58,2.1,0l5.93,5.93c.58.58.58,1.52,0,2.1c-.29.29-.67.43-1.05.43s-.76-.15-1.05-.43L.43,11.44ZM35.61,28.19
    c0,.82-.66,1.48-1.48,1.48c-4.09,0-7.42,3.33-7.42,7.42c0,.82-.66,1.48-1.48,1.48s-1.48-.66-1.48-1.48
    c0-5.73,4.66-10.39,10.39-10.39c.82,0,1.48.66,1.48,1.48Z"
              />
            </svg>
          </div>

          {/* Side Image - Desktop Version */}
          <div className="relative w-full lg:w-2/5 aspect-[4/3] rounded-lg overflow-hidden hidden lg:block">
            <Image
              src="/homepage/sideslide.png"
              alt="Side slide"
              fill
              className="object-contain"
              priority
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 71.21 71.21"
              className="absolute rounded-r-3xl rounded-tl-3xl"
              style={{
                left: '6%',
                bottom: '1%',
                width: '16%',
                height: 'auto',
                backgroundColor: '#1d546b',
                padding: '1.9%',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <path
                fill="#fff"
                d="M62.31,56.48v-17.91c0-14.73-11.98-26.7-26.7-26.7s-26.7,11.98-26.7,26.7v17.91C3.88,57.21,0,61.54,0,66.76
    c0,2.45,2,4.45,4.45,4.45h62.31c2.45,0,4.45-2,4.45-4.45c0-5.22-3.88-9.56-8.9-10.28ZM11.87,38.57
    c0-13.09,10.65-23.74,23.74-23.74s23.74,10.65,23.74,23.74v17.8H11.87v-17.8ZM66.76,68.25H4.45c-.82,0-1.48-.67-1.48-1.48
    c0-4.09,3.33-7.42,7.42-7.42h50.44c4.09,0,7.42,3.33,7.42,7.42C68.24,67.58,67.57,68.25,66.76,68.25ZM50.6,6.75l2.97-5.93
    c.37-.73,1.26-1.03,1.99-.66c.73.37,1.03,1.26.66,1.99l-2.97,5.93c-.26.52-.79.82-1.33.82c-.22,0-.45-.05-.66-.16
    c-.73-.37-1.03-1.26-.66-1.99h0ZM62.75,17.37c-.58-.58-.58-1.52,0-2.1l5.93-5.93c.58-.58,1.52-.58,2.1,0s.58,1.52,0,2.1
    l-5.93,5.93c-.29.29-.67.43-1.05.43s-.76-.15-1.05-.43h0ZM14.99,2.15c-.36-.73-.07-1.62.66-1.99s1.62-.07,1.99.66l2.97,5.93
    c.36.73.07,1.62-.66,1.99c-.21.11-.44.16-.66.16c-.54,0-1.07-.3-1.33-.82l-2.97-5.93h0ZM.43,11.44c-.58-.58-.58-1.52,0-2.1
    s1.52-.58,2.1,0l5.93,5.93c.58.58.58,1.52,0,2.1c-.29.29-.67.43-1.05.43s-.76-.15-1.05-.43L.43,11.44ZM35.61,28.19
    c0,.82-.66,1.48-1.48,1.48c-4.09,0-7.42,3.33-7.42,7.42c0,.82-.66,1.48-1.48,1.48s-1.48-.66-1.48-1.48
    c0-5.73,4.66-10.39,10.39-10.39c.82,0,1.48.66,1.48,1.48Z"
              />
            </svg>
          </div>
        </div>
      </section>

      <div className="w-full p-4 bg-[#f7f8fc] text-black font-bold">
        <div className="flex justify-center">
          <div className="w-11/12 flex flex-col gap-4 lg:flex-row lg:items-center justify-between rounded-2xl bg-white p-4">

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <input
                type="text"
                placeholder="نام و نام خانوادگی"
                className="bg-[#f7f8fc] rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
              />
              <input
                type="text"
                placeholder="تلفن همراه"
                className="bg-[#f7f8fc] rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
              />
              <input
                type="text"
                placeholder="نام دامنه"
                className="bg-[#f7f8fc] rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
              />
              <input
                type="text"
                placeholder="خدمت مورد نظر"
                className="bg-[#f7f8fc] rounded-lg p-2 px-4 text-sm border border-transparent focus:outline-none focus:border-[#6FD6E5] focus:ring-2 focus:ring-[#6FD6E5] transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <div className="w-full lg:w-auto">
              <button className="w-full lg:w-32 h-10 bg-[#6FD6E5] text-white rounded-lg mt-2 lg:mt-0 font-light transition-all duration-200 hover:bg-[#5ac7d7]">
                درخواست نوبت
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10 px-4">
        <div className="flex flex-col lg:flex-row gap-8 justify-center mx-auto items-center w-11/12">

          {/* Left Image */}
          <div className="w-full lg:w-5/12">
            <div className="relative w-full aspect-[16/14] rounded-lg overflow-hidden flex items-start">
              <Image
                src="/homepage/peopleAsset 7.png"
                alt="Main slide"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right Text Content */}
          <div className="w-full lg:w-7/12">
            {/* Title + Icon */}
            <div className="flex items-start">
              <svg
                className="w-6 md:w-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 54.59 52.11"
                fill="#1d546b"
                stroke="#1d546b"
                strokeMiterlimit={10}
              >
                <g>
                  <path d="M43.46,24.24h2.77v2.31c0,.26.21.46.46.46s.46-.21.46-.46v-2.31h2.77c2.29,0,4.16-1.87,4.16-4.16v-7.86c0-4.08-3.32-7.39-7.39-7.39s-7.39,3.32-7.39,7.39v7.86c0,2.29,1.87,4.16,4.16,4.16ZM40.23,12.23c0-3.57,2.9-6.47,6.47-6.47s6.47,2.9,6.47,6.47v7.86c0,1.78-1.45,3.23-3.23,3.23h-6.47c-1.78,0-3.23-1.45-3.23-3.23v-7.86ZM46.23,20.08v-2.77c0-.26.21-.46.46-.46s.46.21.46.46v2.77c0,.26-.21.46-.46.46s-.46-.21-.46-.46Z" />
                  <path d="M45.59,23.77v10.96c0,8.38-6.82,15.2-15.2,15.2s-15.2-6.82-15.2-15.2v-2.21c7.28-.56,13.03-6.65,13.03-14.07V5.43c0-2.99-2.43-5.43-5.43-5.43h-5.43v2.17h5.43c1.8,0,3.26,1.46,3.26,3.26v13.03c0,6.59-5.36,11.94-11.94,11.94S2.17,25.04,2.17,18.45V5.43c0-1.8,1.46-3.26,3.26-3.26h5.43V0h-5.43C2.43,0,0,2.44,0,5.43v13.03c0,7.42,5.75,13.52,13.03,14.07v2.21c0,9.58,7.79,17.37,17.37,17.37s17.37-7.79,17.37-17.37v-10.96" />
                </g>
              </svg>
              <div className="mr-4">
                <p className="text-[#1d546b] text-base md:text-lg">درباره ما</p>
                <div className="flex flex-wrap items-center text-base md:text-lg">
                  <p className="text-gray-800">مرکز تخصصی درمان</p>
                  <p className="text-[#1d546b] pr-2">وب سایت</p>
                </div>
              </div>
            </div>

            {/* Paragraph */}
            <p className="pt-6 text-sm md:text-base text-gray-600 leading-relaxed">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد قرار گیرد.
            </p>

            {/* Footer */}
            <div className="flex flex-row md:flex-row items-center justify-between mt-8 gap-4 md:gap-0">
              {/* Person Info */}
              <div className="flex items-center">
                <div className="w-1 h-12 bg-[#1d546b] rounded-lg"></div>
                <div className="mr-4">
                  <p className="text-gray-800 text-sm md:text-base">دکتر مجتبی خداخواه</p>
                  <p className="text-[#6FD6E5] text-xs md:text-sm">متخصص سئو سایت</p>
                </div>
              </div>

              {/* Button */}
              <div className=" md:w-auto">
                <button className="w-32 h-10 bg-[#6FD6E5] text-white rounded-lg">
                  بیشتر بدانید...
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mt-20">
        {/* Image container (no background color) */}
<div className="w-full relative z-10">
  <div className="w-11/12 m-auto">
    <div className="relative w-full aspect-[22/6] rounded-lg overflow-hidden">
      <Image
        src="/homepage/bigslide.png"
        alt="Main slide"
        fill
        className="object-cover"
      />

      {/* Header */}
      <div className="absolute top-4 right-4 flex items-start z-10 p-4 rounded-xl max-w-[90%]">
        <svg
          className="w-6 sm:w-8"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 54.59 52.11"
          fill="#1d546b"
          stroke="#1d546b"
          strokeMiterlimit={10}
        >
          <g>
            <path d="M43.46,24.24h2.77v2.31c0,.26.21.46.46.46s.46-.21.46-.46v-2.31h2.77c2.29,0,4.16-1.87,4.16-4.16v-7.86c0-4.08-3.32-7.39-7.39-7.39s-7.39,3.32-7.39,7.39v7.86c0,2.29,1.87,4.16,4.16,4.16ZM40.23,12.23c0-3.57,2.9-6.47,6.47-6.47s6.47,2.9,6.47,6.47v7.86c0,1.78-1.45,3.23-3.23,3.23h-6.47c-1.78,0-3.23-1.45-3.23-3.23v-7.86ZM46.23,20.08v-2.77c0-.26.21-.46.46-.46s.46.21.46.46v2.77c0,.26-.21.46-.46.46s-.46-.21-.46-.46Z" />
            <path d="M45.59,23.77v10.96c0,8.38-6.82,15.2-15.2,15.2s-15.2-6.82-15.2-15.2v-2.21c7.28-.56,13.03-6.65,13.03-14.07V5.43c0-2.99-2.43-5.43-5.43-5.43h-5.43v2.17h5.43c1.8,0,3.26,1.46,3.26,3.26v13.03c0,6.59-5.36,11.94-11.94,11.94S2.17,25.04,2.17,18.45V5.43c0-1.8,1.46-3.26,3.26-3.26h5.43V0h-5.43C2.43,0,0,2.44,0,5.43v13.03c0,7.42,5.75,13.52,13.03,14.07v2.21c0,9.58,7.79,17.37,17.37,17.37s17.37-7.79,17.37-17.37v-10.96" />
          </g>
        </svg>
        <div className="mr-4 text-sm sm:text-base">
          <p className="text-[#1d546b] font-semibold">حوزه تخصصی و درمان</p>
          <div className="flex flex-wrap items-center mt-1">
            <p className="text-gray-800 text-xl">خدمات تخصصی کلینیک</p>
            <p className="text-[#6FD6E5] text-xl pr-2">وب و فن</p>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="absolute right-[5%] bottom-[5%] flex flex-col lg:flex-row gap-6 z-20 w-full px-4">
        {/* First Card */}
        <div className="bg-[#1d546b] text-white flex flex-col sm:flex-row items-center rounded-3xl p-6 sm:p-10 w-full lg:w-1/2 text-center sm:text-start text-sm sm:text-base">
          <svg
            className="w-24 h-24 sm:w-40 sm:h-40 mb-4 sm:mb-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 106.53 102.09"
            fill="#f7f8fc"
          >
            <path d="..." />
          </svg>
          <div className="sm:pr-5">
            <h4 className="pb-1">خدمات درمانی سیو</h4>
            <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
          </div>
        </div>

        {/* Second Card */}
        <div className="text-white flex flex-col sm:flex-row items-center border border-white rounded-3xl p-6 sm:p-10 w-full lg:w-1/2 text-center sm:text-start text-sm sm:text-base">
          <svg
            className="w-24 h-24 sm:w-40 sm:h-40 mb-4 sm:mb-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 107.48 103"
            fill="#fff"
          >
            <path d="..." />
          </svg>
          <div className="sm:pr-5">
            <h4 className="pb-1">خدمات درمانی طراحی سایت</h4>
            <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* Background section starts from mid-image */}
        <div className="w-full mt-[-15%] pt-[15%] bg-[#f7f8fc] relative z-0">
          <div className="w-11/12 m-auto">
            <div className="mt-10">
              <div className="flex items-center pr-18">
                <h3 className="text-gray-800">قرص های پر بازدید کیلینیک</h3>
                <h3 className="text-[#6FD6E5] pr-2">وب و فن</h3>
              </div>
              <Popularpills />
            </div>
          </div>
        </div>
      </section>

      <section>
        <Pathsection />
        <div className="w-full">
          <div className="w-11/12 m-auto relative py-20">
            <div className="relative w-full aspect-[13/2] rounded-lg overflow-hidden flex items-start">
              <Image
                src="/homepage/ourteam.png"
                alt="Main slide"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4  items-start z-10 p-4 rounded-xl">
                <div className="mr-4 w-64">
                  <div className="flex items-center gap-6">
                    <p className="text-white text-xl whitespace-nowrap">تیم ما</p>
                    <button
                      className="bg-[#6FD6E5] text-white px-8 py-2 rounded-4xl text-sm hover:scale-105 transition-all"
                    >
                      مشاهده اعضا
                    </button>
                  </div>

                </div>
                <div className="w-[50%] mt-10">
                  <p>
                    لورم ایپسوم متن ساختگی با تولید سادگی  که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود  فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی  مورد نیاز  قرار گیرد.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      <div className="w-full bg-[#f7f8fc] px-4 md:px-20 flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Left Section: Centered Text */}
        <div className="w-full md:w-[40%] flex justify-center items-center text-center md:text-right mt-30">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              مشتریان ، درباره <span className="text-[#3db4c6]">وبوفن</span> چه می‌گویند ؟
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است...
            </p>
          </div>
        </div>

        {/* Right Section: Swiper */}
        <div className="md:w-[60%] w-full">
          <Commentsabtus />
        </div>
      </div>

      <div className="w-full">
        <div className="w-11/12 m-auto relative py-10">
          <Reservetime />
        </div>
      </div>

    </main>
  );
}
