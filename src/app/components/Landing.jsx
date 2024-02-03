import React , {useState , useEffect} from "react";
import { motion } from "framer-motion";
import {Link} from 'react-scroll'
import Image from 'next/image' 
import shoe from '../components/img/shoe.png'
import {Link as RouterLink } from 'react-router-dom'; 

function Landing (){
  const fullTitle = 'NICKERS!';
  const [title, setTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typingTimer;

    if (isDeleting) {
      typingTimer = setTimeout(() => {
        setTitle(title.slice(0, title.length - 1));
        if (title === '') {
          setIsDeleting(false);
        }
      }, 200);
    } else {
      typingTimer = setTimeout(() => {
        setTitle(fullTitle.slice(0, title.length + 1));
        if (title === fullTitle) {
          setIsDeleting(true);
        }
      }, 200);
    }

    return () => clearTimeout(typingTimer);
  }, [title, isDeleting]);

  return (
      <div className="works" id="works">
        {/* left side */}
        <div className="w-left w-left flex flex-col items-center ">
          <div className="awesome">
          <span>
            Rahatınız Için Varız
          </span>
          <span className="">S{title}</span>
            <span className="text-center text-purple-900">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.<br/>
              Quas accusantium soluta facilis eum nulla saepe impedit expedita!<br/>
              Sed saepe odio quo optio doloremque fugit modi,<br /> non aspernatur exercitationem dolor distinctio?<br />
              Lorem ipsum dolor sit amet consectetur adipisicing elit.<br/> 
              Id in natus inventore, sunt deserunt quas rem ipsum sequi quidem molestias debitis, <br />
              maiores dolorum hic a omnis error delectus explicabo ad?<br/>
            </span>

            <div className="relative w-64 h-64 mt-4 mx-auto">
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="spin absolute top-0 left-0 w-full h-full">
                <circle cx="200" cy="200" fill="none"
                  r="100" stroke-width="25" stroke="#E387FF"
                  stroke-dasharray="350 700"
                  stroke-linecap="round" />
              </svg>
              <Link to="/panel" smooth={true} spy={true} className="relative">
                <RouterLink to="/panel">
                  <div className="button s-button mx-auto text-purple-900 animate-pulse opacity-75">Alışverişe Başlayın!</div>
                </RouterLink> 
              </Link>
            </div>
            <div
              className="blur s-blur1"
              style={{ background: "#ABF1FF94" }}
            ></div>
          </div>

          {/* right side */}
        </div>
        <div className="w-right">
          <motion.div
            initial={{ rotate: 45 }}
            whileInView={{ rotate: 0 }}
            viewport={{ margin: "-40px" }}
            transition={{ duration: 3.5, type: "spring" }}
            className="w-mainCircle"
          >
            <motion.div
              initial={{ x: '80%', y: '-80%' }}
              animate={{ x: 0, y: 0 }} 
              transition={{ duration: 1.5, type: "spring"}}>
              <Image src={shoe} alt="Shoe" width={700} height={500} /> 
            </motion.div>
          </motion.div>
          {/* back Circles */}
          <div className="w-backCircle dpurpleCircle"></div>
          <div className="w-backCircle purpleCircle"></div>
        </div>
      </div>
  );
};

export default Landing;
