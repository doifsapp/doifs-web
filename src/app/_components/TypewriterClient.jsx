'use client'

import dynamic from "next/dynamic";

const Typewriter = dynamic(() => import("typewriter-effect"), {
  ssr: false,
});

export function TypewriterClient() {
  return (
    <Typewriter
      onInit={(typewriter) => {
        typewriter
          .pauseFor(1000)
          .typeString('Busque')
          .pauseFor(1000)
          .deleteAll()
          .typeString('Filtre')
          .pauseFor(1000)
          .deleteAll()
          .typeString('Analise')
          .pauseFor(1000)
          .deleteAll()
          .typeString('Search')
          .start();
      }}
      options={{
        autoStart: true,
        loop: false,
        cursor: '|',
        delay: 65,
        deleteSpeed: 40,
      }}
    />
  );
}