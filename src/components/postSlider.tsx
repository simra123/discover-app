import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { BsEyeFill, BsFillHeartFill } from "react-icons/bs";
import { FaComment } from "react-icons/fa";
import { HiVideoCamera } from "react-icons/hi";
import moment from "moment";
// Import Swiper styles
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper";

interface DataProps {
  data: {
    user_id: string;
    username: string;

    type: string;
    post_id: string;
    created: string;
    text: string;
    video: string;

    thumbnail: string;
    link: string;
    stat: {
      likes: number;
      comments: number;
      views: number;
      shares: number;
    };
  }[];
}

const PostSlider: React.FC<DataProps> = ({ data }) => {
  return (
    <>
      <Swiper
        spaceBetween={20}
        centeredSlides={false}
        slidesPerView={2.5}
        //  navigation={true}
        breakpoints={{
          // when window width is >= 640px

          200: {
            //centeredSlides: true,
            //   width: 100,

            spaceBetween: 20,
            slidesPerView: 1,
          },
          450: {
             width: 430,
            //  centeredSlides: true,
            spaceBetween: 15,
            slidesPerView: 1,
          },
          // 575: {
          //   //    width: 430,
          //   centeredSlides: true,
          //   spaceBetween: 15,
          //   slidesPerView: 3,
          // },
        }}
        // navigation={true}
        //     modules={[Navigation]}
        className="mySwiper"
      >
        {data?.map((val: any) => {
          return (
            <SwiperSlide key={val?.link}>
              <Link to={val?.link} target="_blank">
                <div className="position-relative ">
                  <img src={val?.thumbnail} alt="thumbnail" />
                  {val?.type == "video" && (
                    <span className="position-absolute z-300 top-0 end-0 p-2">
                      <HiVideoCamera color="white" size="33" />
                    </span>
                  )}
                </div>

                <div className="slider-content ">
                  <small>{moment(val.created).format(" LLLL")}</small>
                  <p>{val?.text}</p>
                </div>
                <div className="d-flex justify-content-between icons">
                  <span>
                    <BsFillHeartFill size="20" /> likes <br />
                    <small>{val?.stat?.likes}</small>
                  </span>
                  <span>
                    <BsEyeFill size="27" /> Views <br />
                    <small>{val?.stat?.views}</small>
                  </span>
                  <span>
                    <FaComment size="20" /> Comments <br />
                    <small>{val?.stat?.comments}</small>
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};
export default PostSlider;
