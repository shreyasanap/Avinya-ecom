// import React from 'react';
// import './ChatWidget.css'; // Import the CSS file

// const ChatWidget = () => {
//   return (
//     <div className="chat-widget-container">
//       <div className="chat-widget-content">
//         <iframe
//           className="chat-widget-iframe"
//           srcDoc={`<body><script src='https://cdn.botpress.cloud/webchat/v0/inject.js'></script>
//           <script>
//             window.botpressWebChat.init({
//                 'composerPlaceholder': 'Chat with Avinya bot 🤖',
//                 'botId': 'a2447f71-6ff4-4485-a78b-82405d081f24',
//                 'hostUrl': 'https://cdn.botpress.cloud/webchat/v0',
//                 'messagingUrl': 'https://messaging.botpress.cloud',
//                 'clientId': 'a2447f71-6ff4-4485-a78b-82405d081f24',
//                 'enableConversationDeletion': true,
//                 'showPoweredBy': true,
//                 'className': 'webchatIframe',
//                 'containerWidth': '100%25',
//                 'layoutWidth': '100%25',
//                 'hideWidget': true,
//                 'showCloseButton': false,
//                 'disableAnimations': true,
//                 'closeOnEscape': false,
//                 'showConversationsButton': false,
//                 'enableTranscriptDownload': false,
//             });
//           window.botpressWebChat.onEvent(function () { window.botpressWebChat.sendEvent({ type: 'show' }) }, ['LIFECYCLE.LOADED']);
//           </script></body>`}
//           width="100%"
//           height="100%"
//         ></iframe>
//       </div>
//     </div>
//   );
// };

// export default ChatWidget;
