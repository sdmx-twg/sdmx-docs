# Process

## Introduction

In any system that processes data and reference metadata the system
itself is a series of processes and in each of these processes the data
or reference metadata may undergo a series of transitions. This is
particularly true of its path from raw data to published data and
reference metadata. The process model presented here is a generic model
that can capture key information about these stages in both a textual
way and also in a more formalised way by linking to specific
identifiable objects, and by identifying software components that are
used.

## Model – Inheritance and Relationship view

### Class Diagram

![](media/image72.png)

Figure 46: Inheritance and Relationship class diagram of Process and
Transitions

### Explanation of the Diagram

#### Narrative

The Process is a set of hierarchical ProcessSteps. Each ProcessStep can
take zero or more *IdentifiableArtefact*s as input and output. Each of
the associations to the input and output *IdentifiableArtefact*s
(ProcessArtefact) can be assigned a localID.

The computation performed by a ProcessStep is optionally described by a
Computation, which can identify the software used by the ProcessStep and
can also be described in textual form (+description) in multiple
language variants. The Transition describes the execution of
ProcessSteps from +source ProcessStep to +target ProcessStep based on
the outcome of a +condition that can be described in multiple language
variants.

#### Definitions

| Class | Feature | Description |
| :--- | :--- | :--- |
| Process | <p>Inherits from</p><br><p>Maintainable</p> | A scheme which defines or documents the operations performed on data<br>or metadata in order to validate data or metadata to derive new<br>information according to a given set of rules. |
|  | +step | Associates the Process Steps. |
| ProcessStep | <p>Inherits from</p><br><p><em>IdentifiableArtefact</em></p> | A specific operation, performed on data or metadata in order to<br>validate or to derive new information according to a given set of<br>rules. |
|  | +input | Association to the Process Artefact that identifies the objects<br>which are input to the Process Step. |
|  | +output | Association to the Process Artefact that identifies the objects<br>which are output from the Process Step. |
|  | +child | Association to child Processes that combine to form a part of this<br>Process. |
|  | +computation | Association to one or more Computations. |
|  | +transition | Association to one or more Transitions. |
| Computation |  | Describes in textual form the computations involved in the<br>process. |
|  | localId | Distinguishes between Computations in the same Process. |
|  | softwarePackage<br/><br>softwareLanguage<br/><br>softwareVersion | Information about the software that is used to perform the<br>computation. |
|  | +description | Text describing or giving additional information about the<br>computation. This can be in multiple language variants. |
| Transition | <p>Inherits from</p><br><p><em>IdentifiableArtefact</em></p> | An expression in a textual or formalised way of the transformation<br>of data between two specific operations (Processes) performed on the<br>data. |
|  | +target | Associates the Process Step that is the target of the<br>Transition. |
|  | +condition | Associates a textual description of the Transition. |
| ProcessArtefact |  | Identification of an object that is an input to or an output from a<br>Process Step. |
|  | +artefact | Association to an Identifiable Artefact that is the input to or the<br>output from the Process Step. |