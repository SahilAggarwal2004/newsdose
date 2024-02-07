import Head from "next/head";

export default function Offline() {
    return <>
        <Head><title>You are Offline!</title></Head>
        <div className="w-100 h-100 d-flex justify-content-center align-items-center top-0 start-0 position-fixed">
            <div className='text-center px-4'>
                <h2 className='mb-2'>Offline...</h2>
                <p>The current page isn&#39;t available offline. Please try again when you&#39;re back online.</p>
            </div>
        </div>
    </>
}