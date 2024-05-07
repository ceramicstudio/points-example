// This is an auto-generated file, do not edit manually
export const definition = {
    models: {
      ContextPointAllocation: {
        interface: false,
        implements: [
          "kjzl6hvfrbw6cakj74rf7d3qjnm3xoydcgx7orzw4bwdmc6kljd04uojuhpef2j",
          "kjzl6hvfrbw6c6lxvcf8bc07wjyn29ocoxqn877uia1y86qph79axtdrcuijpeo",
        ],
        id: "kjzl6hvfrbw6camkasus47aykb1bkj3arplxwt3ckpj8bczse8kaf7wcdwoa3cy",
        accountRelation: { type: "list" },
      },
      PointsAllocationInterface: {
        interface: true,
        implements: [
          "kjzl6hvfrbw6c6lxvcf8bc07wjyn29ocoxqn877uia1y86qph79axtdrcuijpeo",
        ],
        id: "kjzl6hvfrbw6cakj74rf7d3qjnm3xoydcgx7orzw4bwdmc6kljd04uojuhpef2j",
        accountRelation: { type: "none" },
      },
      ContextPointAggregation: {
          interface: false,
          implements: [
            "kjzl6hvfrbw6c5m5bxe6jl7cocyxpg9b8em5w9mo3l8ws4zl5c0tu5vgapitpvk",
            "kjzl6hvfrbw6c6lxvcf8bc07wjyn29ocoxqn877uia1y86qph79axtdrcuijpeo",
          ],
          id: "kjzl6hvfrbw6cbe5nn2fktpmpbq42ouepa91pjv899k01yluz6r1zuq5phlliaq",
          accountRelation: { type: "set", fields: ["recipient", "context"] },
        },
        PointsAggregationInterface: {
          interface: true,
          implements: [
            "kjzl6hvfrbw6c6lxvcf8bc07wjyn29ocoxqn877uia1y86qph79axtdrcuijpeo",
          ],
          id: "kjzl6hvfrbw6c5m5bxe6jl7cocyxpg9b8em5w9mo3l8ws4zl5c0tu5vgapitpvk",
          accountRelation: { type: "none" },
        },
    },
    objects: {
      ContextPointAllocation: {
        date: {
          type: "datetime",
          required: true,
          immutable: false,
          indexed: true,
        },
        points: { type: "integer", required: true, immutable: false },
        context: {
          type: "string",
          required: true,
          immutable: false,
          indexed: true,
        },
        recipient: {
          type: "did",
          required: true,
          immutable: false,
          indexed: true,
        },
        multiplier: {
          type: "integer",
          required: false,
          immutable: false,
          indexed: true,
        },
        issuer: { type: "view", viewType: "documentAccount" },
      },
      PointsAllocationInterface: {
        points: { type: "integer", required: true, immutable: false },
        recipient: { type: "did", required: true, immutable: false },
        issuer: { type: "view", viewType: "documentAccount" },
      },
      ContextPointAggregation: {
          date: { type: "datetime", required: true, immutable: false },
          points: { type: "integer", required: true, immutable: false },
          context: { type: "string", required: true, immutable: true },
          recipient: { type: "did", required: true, immutable: true },
          issuer: { type: "view", viewType: "documentAccount" },
        },
        PointsAggregationInterface: {
          date: { type: "datetime", required: true, immutable: false },
          points: { type: "integer", required: true, immutable: false },
          recipient: { type: "did", required: true, immutable: false },
          issuer: { type: "view", viewType: "documentAccount" },
        },
    },
    enums: {},
    accountData: {
      contextPointAllocationList: {
        type: "connection",
        name: "ContextPointAllocation",
      },
      pointsAllocationInterfaceList: {
        type: "connection",
        name: "PointsAllocationInterface",
      },
      recipientOfContextPointAllocationList: {
        type: "account",
        name: "ContextPointAllocation",
        property: "recipient",
      },
      recipientOfPointsAllocationInterfaceList: {
        type: "account",
        name: "PointsAllocationInterface",
        property: "recipient",
      },
      contextPointAggregation: { type: "set", name: "ContextPointAggregation" },
      contextPointAggregationList: {
        type: "connection",
        name: "ContextPointAggregation",
      },
      pointsAggregationInterfaceList: {
        type: "connection",
        name: "PointsAggregationInterface",
      },
      recipientOfContextPointAggregation: {
        type: "account-set",
        name: "ContextPointAggregation",
        property: "recipient",
      },
      recipientOfContextPointAggregationList: {
        type: "account",
        name: "ContextPointAggregation",
        property: "recipient",
      },
      recipientOfPointsAggregationInterfaceList: {
        type: "account",
        name: "PointsAggregationInterface",
        property: "recipient",
      },
    },
  };
  