/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from "next/script"

export default function GetApi() {
    return (
    <>
        <Script 
            src="https://api-maps.yandex.ru/2.1/?apikey=43aad3d9-8d02-4c5a-921e-cde0422a2db8&lang=ru_RU" 
            strategy="beforeInteractive"
        />
    </>
    )
}