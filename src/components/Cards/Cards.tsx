"use client";

import { cn } from "@/functions/classnames";
import { motion, useAnimate, useMotionValue } from "framer-motion";
import Image from "next/image";
import { RefObject, useCallback, useEffect, useState } from "react";

const images = [
  {
    src: "/1.webp",
    fallbackSrc: "https://picsum.photos/900/900?random=1",
    caption: "Cat",
  },
  {
    src: "/2.jpg",
    fallbackSrc: "https://picsum.photos/910/910?random=134",
    caption: "Tiger",
  },
  {
    src: "/3.jpg",
    fallbackSrc: "https://picsum.photos/1000/1000?random=2121",
    caption: "Rabbit",
  },
  {
    src: "/4.jpg",
    fallbackSrc: "https://picsum.photos/950/950?random=12",
    caption: "Dog",
  },
];

export const Cards = () => {
  const [allCardSwiped, setAllCardSwiped] = useState(false);
  const [currentlyActiveIndex, setCurrentlyActiveIndex] = useState(
    images.length - 1
  );
  const [scope, animate] = useAnimate();

  const animateCard = useCallback(
    (selector: string, rotate: number[], delay?: number) => {
      return animate(
        selector,
        { scale: [0.2, 1], opacity: [0, 1], rotate },
        {
          type: "spring",
          stiffness: 300,
          damping: 18,
          delay: delay,
        }
      );
    },
    [animate]
  );

  useEffect(() => {
    const animation = async () => {
      animateCard(".card-0", [0, 6]);
      animateCard(".card-1", [0, -6], 0.3);
      animateCard(".card-2", [6, 0], 0.5);
      animateCard(".card-3", [6, -4], 0.7);
    };
    animation();
  }, [animateCard]);

  return (
    <div
      ref={scope}
      className="relative text-xs size-[min(600px,100vw)] flex items-center justify-center mx-auto"
    >
      {images.map((item, index) => (
        <Item
          src={item.src}
          caption={item.caption}
          itemIndex={index}
          totalItems={images.length}
          dragConstraints={scope}
          allCardSwiped={allCardSwiped}
          currentlyActiveIndex={currentlyActiveIndex}
          setCurrentlyActiveIndex={setCurrentlyActiveIndex}
          setAllCardSwiped={setAllCardSwiped}
          key={item.src}
        />
      ))}
    </div>
  );
};

interface ItemProps {
  src: string;
  itemIndex: number;
  dragConstraints: RefObject<HTMLDivElement>;
  totalItems: number;
  allCardSwiped: boolean;
  setAllCardSwiped: (value: boolean) => void;
  currentlyActiveIndex: number;
  setCurrentlyActiveIndex: (value: number) => void;
  caption: string;
}

const Item = ({
  src,
  itemIndex,
  dragConstraints,
  totalItems,
  currentlyActiveIndex,
  setCurrentlyActiveIndex,
  allCardSwiped,
  setAllCardSwiped,
  caption,
}: ItemProps) => {
  const DRAG_THRESHOLD = 70;

  const [scope, animate] = useAnimate();
  const cardMotionY = useMotionValue(0);
  const cardMotionX = useMotionValue(0);
  const opacity = useMotionValue(1);
  const zIndex = useMotionValue(itemIndex + totalItems);

  const onDragEnd = () => {
    animate(
      [
        [cardMotionX, 0],
        [cardMotionY, 0, { at: "<" }],
      ],
      { duration: 0.3 }
    );

    if (
      Math.abs(cardMotionX.get()) > DRAG_THRESHOLD ||
      Math.abs(cardMotionY.get()) > DRAG_THRESHOLD
    ) {
      handleSuccessfulDrag();
    }
  };

  const handleSuccessfulDrag = () => {
    opacity.set(0);
    zIndex.set(itemIndex - totalItems);

    if (Math.abs(itemIndex - totalItems) === totalItems) {
      setAllCardSwiped(true);
      setCurrentlyActiveIndex(totalItems - 1);
    } else {
      setCurrentlyActiveIndex(itemIndex - 1);
    }
  };

  useEffect(() => {
    if (allCardSwiped) {
      opacity.set(1);
      zIndex.set(itemIndex + totalItems);
      setAllCardSwiped(false);
    }
  }, [allCardSwiped, setAllCardSwiped, itemIndex, opacity, totalItems, zIndex]);

  const cardProps = {
    drag: true,
    ref: scope,
    dragConstraints,
    dragMomentum: false,
    dragSnapToOrigin: true,
    onDragEnd,
    dragElastic: 0.3,
    initial: { scale: 0, opacity: 0.3, rotate: 0 },
    className: cn(
      "absolute h-[min(180px,60vw)] w-[min(165px,60vw)] shadow-md grid place-items-center rounded-sm bg-white",
      {
        [`card-${itemIndex}`]: true,
        "pointer-events-none": currentlyActiveIndex !== itemIndex,
      }
    ),
  };

  return (
    <>
      <motion.div
        {...cardProps}
        style={{
          opacity,
          zIndex,
          y: cardMotionY,
          x: cardMotionX,
        }}
      >
        <Image
          className="p-[4px] pb-[30px] h-full [-webkit-user-drag:none] select-none w-full absolute object-cover"
          alt="image"
          width={800}
          height={800}
          src={src}
          priority
          loading="eager"
          quality={100}
        />
        <p className="absolute bottom-2 inset-x-0 pl-[6px]">{caption}</p>
      </motion.div>
      <motion.div
        {...cardProps}
        style={{
          y: cardMotionY,
          x: cardMotionX,
        }}
      >
        <Image
          className="p-[4px] pb-[30px] h-full [-webkit-user-drag:none] select-none w-full absolute object-cover"
          alt="image"
          width={800}
          height={800}
          src={src}
          priority
          loading="eager"
          quality={100}
        />
        <p className="absolute bottom-2 inset-x-0 pl-[6px]">{caption}</p>
      </motion.div>
    </>
  );
};
