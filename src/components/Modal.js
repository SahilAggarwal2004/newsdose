import React, { useContext } from 'react'
import Context from '../context/Context';
import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon } from 'react-share';

export default function Modal() {
    const { shareUrl } = useContext(Context);
    const title = 'News shared via NewsDose. Visit now for more: https://newsdoseweb.netlify.app/'
    const share = `${shareUrl}%0a%0a${title}`
    const shareWhatsapp = `whatsapp://send?text=${share}`

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-center w-100" id="exampleModalLabel">Share news with your friends!</h5>
                    </div>
                    <div className="modal-body d-flex flex-column">
                        <div className='m-auto mb-3 text-center'>
                            <a href={shareWhatsapp} target='_blank' rel='noreferrer' style={{ outline: 'none' }}>
                                <WhatsappIcon size={40} className="mx-1 p-1" />
                            </a>
                            <TelegramShareButton url={shareUrl} title={title} style={{ outline: 'none' }}>
                                <TelegramIcon size={40} className="mx-1 p-1" />
                            </TelegramShareButton>
                            <LinkedinShareButton url={shareUrl} style={{ outline: 'none' }}>
                                <LinkedinIcon size={40} className="mx-1 p-1" />
                            </LinkedinShareButton>
                            <RedditShareButton url={shareUrl} title={title} style={{ outline: 'none' }}>
                                <RedditIcon size={40} className="mx-1 p-1" />
                            </RedditShareButton>
                            <TwitterShareButton url={shareUrl} title={title} style={{ outline: 'none' }}>
                                <TwitterIcon size={40} className="mx-1 p-1" />
                            </TwitterShareButton>
                            <FacebookShareButton url={shareUrl} quote={title} style={{ outline: 'none' }}>
                                <FacebookIcon size={40} className="mx-1 p-1" />
                            </FacebookShareButton>
                        </div>
                        <button type="button" className="btn btn-dark px-2 py-1 align-self-end" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div >
    )
}
