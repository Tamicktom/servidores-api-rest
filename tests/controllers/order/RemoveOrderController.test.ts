import { Request, Response } from "express";
import RemoveOrderController, {
  RemoveOrderDTO,
} from "../../../src/controllers/order/RemoveOrderController";
import RemoveOrderService from "../../../src/services/order/RemoveOrderService";
import z from "zod";

jest.mock("../../../src/services/order/RemoveOrderService");

describe("RemoveOrderController", () => {
  let removeOrderController: RemoveOrderController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    removeOrderController = new RemoveOrderController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("handle", () => {
    it("should remove an order and return it in the response", async () => {
      const mockOrderId = "mockOrderId";
      const mockOrder = { id: mockOrderId /* other order properties */ };

      mockRequest.params = { id: mockOrderId };
      RemoveOrderService.prototype.execute = jest
        .fn()
        .mockResolvedValue(mockOrder);

      await removeOrderController.handle(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(RemoveOrderService.prototype.execute).toHaveBeenCalledWith({
        id: mockOrderId,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
    });

    it("should return 400 status with error message if the request parameters are invalid", async () => {
      const mockErrorMessage = "Invalid request parameters";

      mockRequest.params = { id: "invalidId" };
      RemoveOrderService.prototype.execute = jest.fn();
      z.ZodError.create = jest
        .fn()
        .mockReturnValue(new Error(mockErrorMessage));

      await removeOrderController.handle(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(RemoveOrderService.prototype.execute).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: mockErrorMessage,
      });
    });

    it("should return 500 status with error message if an internal server error occurs", async () => {
      mockRequest.params = { id: "validId" };
      RemoveOrderService.prototype.execute = jest
        .fn()
        .mockRejectedValue(new Error());

      await removeOrderController.handle(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(RemoveOrderService.prototype.execute).toHaveBeenCalledWith({
        id: "validId",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
