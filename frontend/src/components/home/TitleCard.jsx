import React from 'react'

const TitleCard = ({title, subTitle, titleColor, subTitleColor}) => {
  return (
    <div className="text-center mb-16">
        <h2 className={`text-4xl font-bold ${titleColor} mb-4`}>
            {title}
        </h2>
        <p className={`text-xl ${subTitleColor} max-w-2xl mx-auto`}>
            {subTitle}
        </p>
    </div>
  )
}

export default TitleCard