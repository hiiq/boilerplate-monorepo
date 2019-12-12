import React from 'react';
import { render } from 'testHelpers';
import { Dashboard } from './component';

jest.mock('shared/Content');
jest.mock('shared/Page');

describe('<Dashboard/>', () => {
  const defaultProps = {};

  const renderComponent = overrides =>
    render(<Dashboard {...defaultProps} {...overrides} />);

  test('renders about page', () => {
    const { container } = renderComponent();

    expect(container.firstChild).toMatchSnapshot();
  });
});
