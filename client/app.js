const { useState } = React;

function App() {
  const [link, setLink] = useState('');

  const createCall = async () => {
    const res = await fetch('/api/create-call', { method: 'POST' });
    const data = await res.json();
    setLink(`${window.location.origin}/call/${data.roomId}`);
  };

  return (
    React.createElement('div', null,
      React.createElement('h1', null, 'KonKon'),
      React.createElement('button', { onClick: createCall }, 'Create Call'),
      link && React.createElement('p', null,
        'Share link: ',
        React.createElement('a', { href: link }, link)
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));

if (typeof module !== 'undefined') {
  module.exports = App;
}
