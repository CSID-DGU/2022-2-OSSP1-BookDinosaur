import render from '@testing-library/react';
import Footer from './Footer';

test('matches snapshot', () => {
    const utils = render(
        <Footer />
    )
    expect(utils.container).toMatchSnapshot();
})
