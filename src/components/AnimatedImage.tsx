"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image';
import hero_img from "../../public/hero_img.svg"

function AnimatedImage() {
  return <div>
    <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        whileHover={{ scale: 1.2, rotate: 10, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        style={{ display: 'inline-block' }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
        >
          <Image src={hero_img} alt="hero_img" className="w-[250px] animate-wiggle"/>
        </motion.div>
      </motion.div>
  </div>
}

export default AnimatedImage