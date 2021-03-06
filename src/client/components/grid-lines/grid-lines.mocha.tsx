import { expect } from 'chai';
import * as sinon from 'sinon';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import '../../utils/test-utils/index';

import * as TestUtils from 'react-addons-test-utils';

import { StageMock } from '../../../common/models/mocks';

import { $, Expression } from 'plywood';
import { GridLines } from './grid-lines';

describe('GridLines', () => {
  it('adds the correct class', () => {
    var renderedComponent = TestUtils.renderIntoDocument(
      <GridLines
        orientation={null}
        scale={null}
        stage={StageMock.defaultB()}
        ticks={[]}
      />
    );

    expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
    expect((ReactDOM.findDOMNode(renderedComponent) as any).className, 'should contain class').to.contain('grid-lines');
  });

});
