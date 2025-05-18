const React = require('react');
const { render, fireEvent, screen } = require('@testing-library/react');
const App = require('../app');

describe('App', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ roomId: 'test' }) })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a call link when clicking the button', async () => {
    render(React.createElement(App));
    fireEvent.click(screen.getByText('Create Call'));
    const link = await screen.findByRole('link');
    expect(link.getAttribute('href')).toContain('/call/test');
  });
});
