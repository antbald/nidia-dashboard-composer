from .rooms_module import RoomsModule

AVAILABLE_MODULES = {
    "home": RoomsModule,
}

__all__ = ["AVAILABLE_MODULES", "RoomsModule"]
