import { message } from 'antd';
import successIcon from '../../public/images/success.svg';
import errorIcon from '../../public/images/attention.svg';

const success = (content) => {
    message.success({ content: content, icon: <img className='message-icon' src={ successIcon } /> });
};

let errorMessages = {};

const error = (content) => {

    if (!errorMessages[content]) {
        errorMessages[content] = content;
        
        message.error({ content: content, icon: <img className='message-icon' src={ errorIcon } /> })
            .then(() => {
                delete errorMessages[content];
            });
    }
    
};
const warning = (content) => {
    message.warning({ content: content, icon: <img className='message-icon' src={ errorIcon } /> });
};

const info = (content) => {
    message.info({ content: content });
};                                                                                                                                                                                                                                                                  

const loading = (content) => {
    message.loading({ content: content });
};

export { success, error, info, warning, loading };
