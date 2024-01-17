// TODO: torn, can either bake this here; or have to create a whole new button type
// Only ways that you can pass in a custom React component for render :l
import {
  // ExpandableToolbarButton,
  // ListMenu,
  WindowLevelMenuItem,
} from '@ohif/ui';
import { defaults, ToolbarService } from '@ohif/core';
import type { Button, RunCommand } from '@ohif/core/types';
import { EVENTS } from '@cornerstonejs/core';

const { windowLevelPresets } = defaults;

const _createActionButton = ToolbarService._createButton.bind(null, 'action');
const _createToggleButton = ToolbarService._createButton.bind(null, 'toggle');
const _createToolButton = ToolbarService._createButton.bind(null, 'tool');

/**
 *
 * @param {*} preset - preset number (from above import)
 * @param {*} title
 * @param {*} subtitle
 */
function _createWwwcPreset(preset, title, subtitle) {
  return {
    id: preset.toString(),
    title,
    subtitle,
    type: 'action',
    commands: [
      {
        commandName: 'setWindowLevel',
        commandOptions: {
          ...windowLevelPresets[preset],
        },
        context: 'CORNERSTONE',
      },
    ],
  };
}

const toolGroupIds = ['default', 'mpr', 'SRToolGroup'];

/**
 * Creates an array of 'setToolActive' commands for the given toolName - one for
 * each toolGroupId specified in toolGroupIds.
 * @param {string} toolName
 * @returns {Array} an array of 'setToolActive' commands
 */
function _createSetToolActiveCommands(toolName) {
  const temp = toolGroupIds.map(toolGroupId => ({
    commandName: 'setToolActive',
    commandOptions: {
      toolGroupId,
      toolName,
    },
    context: 'CORNERSTONE',
  }));
  return temp;
}

const ReferenceLinesCommands: RunCommand = [
  {
    commandName: 'setSourceViewportForReferenceLinesTool',
    context: 'CORNERSTONE',
  },
  {
    commandName: 'setToolActive',
    commandOptions: {
      toolName: 'ReferenceLines',
    },
    context: 'CORNERSTONE',
  },
];

const toolbarButtons: Button[] = [
  // Measurement
  {
    id: 'MeasurementTools',
    type: 'ohif.splitButton',
    props: {
      groupId: 'MeasurementTools',
      isRadio: true, // ?
      // Switch?
      primary: _createToolButton(
        'Length',
        'tool-length',
        'Length',
        [
          {
            commandName: 'setToolActive',
            commandOptions: {
              toolName: 'Length',
            },
            context: 'CORNERSTONE',
          },
          {
            commandName: 'setToolActive',
            commandOptions: {
              toolName: 'SRLength',
              toolGroupId: 'SRToolGroup',
            },
            // we can use the setToolActive command for this from Cornerstone commandsModule
            context: 'CORNERSTONE',
          },
        ],
        'Length'
      ),
      secondary: {
        icon: 'chevron-down',
        label: '',
        isActive: true,
        tooltip: 'More Measure Tools',
      },
      items: [
        _createToolButton(
          'Length',
          'tool-length',
          'Length',
          [
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'Length',
              },
              context: 'CORNERSTONE',
            },
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'SRLength',
                toolGroupId: 'SRToolGroup',
              },
              // we can use the setToolActive command for this from Cornerstone commandsModule
              context: 'CORNERSTONE',
            },
          ],
          'Length Tool'
        ),
        _createToolButton(
          'Bidirectional',
          'tool-bidirectional',
          'Bidirectional',
          [
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'Bidirectional',
              },
              context: 'CORNERSTONE',
            },
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'SRBidirectional',
                toolGroupId: 'SRToolGroup',
              },
              context: 'CORNERSTONE',
            },
          ],
          'Bidirectional Tool'
        ),
        _createToolButton(
          'ArrowAnnotate',
          'tool-annotate',
          'Annotation',
          [
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'ArrowAnnotate',
              },
              context: 'CORNERSTONE',
            },
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'SRArrowAnnotate',
                toolGroupId: 'SRToolGroup',
              },
              context: 'CORNERSTONE',
            },
          ],
          'Arrow Annotate'
        ),
        _createToolButton(
          'EllipticalROI',
          'tool-elipse',
          'Ellipse',
          [
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'EllipticalROI',
              },
              context: 'CORNERSTONE',
            },
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'SREllipticalROI',
                toolGroupId: 'SRToolGroup',
              },
              context: 'CORNERSTONE',
            },
          ],
          'Ellipse Tool'
        ),
        _createToolButton(
          'CircleROI',
          'tool-circle',
          'Circle',
          [
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'CircleROI',
              },
              context: 'CORNERSTONE',
            },
            {
              commandName: 'setToolActive',
              commandOptions: {
                toolName: 'SRCircleROI',
                toolGroupId: 'SRToolGroup',
              },
              context: 'CORNERSTONE',
            },
          ],
          'Circle Tool'
        ),
      ],
    },
  },
  // Zoom..
  {
    id: 'Zoom',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-zoom',
      label: 'Zoom',
      commands: _createSetToolActiveCommands('Zoom'),
    },
  },
  // Window Level + Presets...
  {
    id: 'WindowLevel',
    type: 'ohif.splitButton',
    props: {
      groupId: 'WindowLevel',
      primary: _createToolButton(
        'WindowLevel',
        'tool-window-level',
        'Window Level',
        [
          {
            commandName: 'setToolActive',
            commandOptions: {
              toolName: 'WindowLevel',
            },
            context: 'CORNERSTONE',
          },
        ],
        'Window Level'
      ),
      secondary: {
        icon: 'chevron-down',
        label: 'W/L Manual',
        isActive: true,
        tooltip: 'W/L Presets',
      },
      isAction: true, // ?
      renderer: WindowLevelMenuItem,
      items: [
        _createWwwcPreset(1, 'Soft tissue', '400 / 40'),
        _createWwwcPreset(2, 'Lung', '1500 / -600'),
        _createWwwcPreset(3, 'Liver', '150 / 90'),
        _createWwwcPreset(4, 'Bone', '2500 / 480'),
        _createWwwcPreset(5, 'Brain', '80 / 40'),
      ],
    },
  },
  // Pan...
  {
    id: 'Pan',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-move',
      label: 'Pan',
      commands: _createSetToolActiveCommands('Pan'),
    },
  },
  {
    id: 'Capture',
    type: 'ohif.action',
    props: {
      icon: 'tool-capture',
      label: 'Capture',
      type: 'action',
      commands: [
        {
          commandName: 'showDownloadViewportModal',
          commandOptions: {},
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  //// Shivkaran
  {
    id: 'Probe',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-probe',
      label: 'Probe',
      commands: [
        {
          commandName: 'setToolActive',
          commandOptions: {
            toolName: 'DragProbe',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'rotate-right',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-rotate-right',
      label: 'Rotate Right',
      commands: [
        {
          commandName: 'rotateViewportCW',
          commandOptions: {},
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'StackImageSync',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'link',
      label: 'Stack Image Sync',
      commands: [
        {
          commandName: 'toggleStackImageSync',
          commandOptions: {},
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'StackScroll',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-stack-scroll',
      label: 'Stack Scroll',
      commands: [
        {
          commandName: 'setToolActive',
          commandOptions: {
            toolName: 'StackScroll',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'flip-horizontal',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-flip-horizontal',
      label: 'Flip Horizontal',
      commands: [
        {
          commandName: 'flipViewportHorizontal',
          commandOptions: {
            toolName: 'flip-horizontal',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'ImageOverlayViewer',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'toggle-dicom-overlay',
      label: 'Image Overlay',
      commands: [
        {
          commandName: 'setToolActive',
          commandOptions: {
            toolName: 'ImageOverlayViewer',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'invert',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-invert',
      label: 'Invert',
      commands: [
        {
          commandName: 'invertViewport',
          commandOptions: {
            toolName: 'invert',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'cine',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-cine',
      label: 'Cine',
      commands: [
        {
          commandName: 'toggleCine',
          commandOptions: {
            toolName: 'cine',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'Angle',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-angle',
      label: 'Angle',
      commands: [
        {
          commandName: 'setToolActive',
          commandOptions: {
            toolName: 'Angle',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'Magnify',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-magnify',
      label: 'Magnify',
      commands: [
        {
          commandName: 'setToolActive',
          commandOptions: {
            toolName: 'Magnify',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'Rectangle',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-rectangle',
      label: 'Rectangle',
      commands: [
        {
          commandName: 'setToolActive',
          commandOptions: {
            toolName: 'RectangleROI',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'CalibrationLine',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-calibration',
      label: 'Calibration',
      commands: [
        {
          commandName: 'setToolActive',
          commandOptions: {
            toolName: 'CalibrationLine',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  {
    id: 'TagBrowser',
    type: 'ohif.action',
    props: {
      type: 'action',
      icon: 'list-bullets',
      label: 'Dicom Tag Browser',
      commands: [
        {
          commandName: 'openDICOMTagViewer',
          commandOptions: {},
          context: 'DEFAULT',
        },
      ],
    },
  },
  {
    id: 'Reset',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-reset',
      label: 'Reset View',
      commands: [
        {
          commandName: 'resetViewport',
          commandOptions: {},
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  //// Shivkaran
  {
    id: 'Layout',
    type: 'ohif.layoutSelector',
    props: {
      rows: 3,
      columns: 3,
    },
  },
  {
    id: 'MPR',
    type: 'ohif.action',
    props: {
      type: 'toggle',
      icon: 'icon-mpr',
      label: 'MPR',
      commands: [
        {
          commandName: 'toggleHangingProtocol',
          commandOptions: {
            protocolId: 'mpr',
          },
          context: 'DEFAULT',
        },
      ],
    },
  },
  {
    id: 'Crosshairs',
    type: 'ohif.radioGroup',
    props: {
      type: 'tool',
      icon: 'tool-crosshair',
      label: 'Crosshairs',
      commands: [
        {
          commandName: 'setToolActive',
          commandOptions: {
            toolName: 'Crosshairs',
            toolGroupId: 'mpr',
          },
          context: 'CORNERSTONE',
        },
      ],
    },
  },
  // More...
  {
    id: 'MoreTools',
    type: 'ohif.splitButton',
    props: {
      isRadio: true, // ?
      groupId: 'MoreTools',
      primary: _createToggleButton(
        'ReferenceLines',
        'tool-referenceLines', // change this with the new icon
        'Reference Lines',
        ReferenceLinesCommands,
        'Show Reference Lines',
        {
          listeners: {
            [EVENTS.STACK_VIEWPORT_NEW_STACK]: ReferenceLinesCommands,
            [EVENTS.ACTIVE_VIEWPORT_ID_CHANGED]: ReferenceLinesCommands,
          },
        }
      ),
      secondary: {
        icon: 'chevron-down',
        label: '',
        isActive: true,
        //tooltip: 'More Tools',
        tooltip: '',
      },
      items: [
        // Next two tools can be added once icons are added
        // _createToolButton(
        //   'Cobb Angle',
        //   'tool-cobb-angle',
        //   'Cobb Angle',
        //   [
        //     {
        //       commandName: 'setToolActive',
        //       commandOptions: {
        //         toolName: 'CobbAngle',
        //       },
        //       context: 'CORNERSTONE',
        //     },
        //   ],
        //   'Cobb Angle'
        // ),
        // _createToolButton(
        //   'Planar Freehand ROI',
        //   'tool-freehand',
        //   'PlanarFreehandROI',
        //   [
        //     {
        //       commandName: 'setToolActive',
        //       commandOptions: {
        //         toolName: 'PlanarFreehandROI',
        //       },
        //       context: 'CORNERSTONE',
        //     },
        //   ],
        //   'Planar Freehand ROI'
        // ),
      ],
    },
  },
];

export default toolbarButtons;
