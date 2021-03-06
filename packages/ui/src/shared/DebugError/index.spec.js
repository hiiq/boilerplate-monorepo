import React from 'react';
import { render } from 'testHelpers';
import { DebugError } from '.';

describe('<DebugError/>', () => {
  const defaultProps = {
    message: 'MESSAGE',
  };

  const renderComponent = (overrides) =>
    render(<DebugError {...defaultProps} {...overrides} />);

  test('renders children', () => {
    const { container } = renderComponent();

    expect(container.firstChild).toMatchSnapshot();
  });

  test('passes class name', () => {
    const className = 'CLASS_NAME';
    const { container } = renderComponent({ className });

    expect(container.firstChild).toHaveClass(className);
  });
});
