import { FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, XIcon, TwitterShareButton, WhatsappIcon } from 'react-share';
import { title } from '@/constants';
import { useNewsContext } from '@/contexts/ContextProvider';

export default function Modal() {
    const { shareUrl } = useNewsContext()

    return <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title text-center w-100" id="exampleModalLabel">Share news with your friends!</h5>
                </div>
                <div className="modal-body d-flex flex-column">
                    <div className='m-auto mb-3 text-center'>
                        <a href={`whatsapp://send?text=${shareUrl}%0a%0a${title}`} target='_blank' rel='noreferrer'>
                            <WhatsappIcon size={32} className="mx-2" />
                        </a>
                        <TelegramShareButton url={shareUrl} title={title}>
                            <TelegramIcon size={32} className="mx-2" />
                        </TelegramShareButton>
                        <RedditShareButton url={shareUrl} title={title}>
                            <RedditIcon size={32} className="mx-2" />
                        </RedditShareButton>
                        <LinkedinShareButton url={shareUrl}>
                            <LinkedinIcon size={32} className="mx-2" />
                        </LinkedinShareButton>
                        <TwitterShareButton url={shareUrl} title={title}>
                            <XIcon size={32} className="mx-2" />
                        </TwitterShareButton>
                        <FacebookShareButton url={shareUrl}>
                            <FacebookIcon size={32} className="mx-2" />
                        </FacebookShareButton>
                    </div>
                    <button type="button" className="btn btn-dark px-2 py-1 align-self-end" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
}